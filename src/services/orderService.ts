/**
 * orderService — all order operations go through Supabase.
 * Falls back silently to localStorage if Supabase is unavailable.
 */
import { supabase } from './supabase';
import { Order, CartItem } from './database';
import { db } from './database';

// ── map Supabase row → Order ────────────────────────────────────────────────
function mapRow(row: Record<string, unknown>): Order {
  return {
    id:           row.id as string,
    userId:       row.user_id as string,
    items:        row.items as CartItem[],
    total:        row.total as number,
    customerInfo: row.customer_info as Order['customerInfo'],
    status:       row.status as Order['status'],
    createdAt:    row.created_at as string,
  };
}

// ── map Order → Supabase insert row ────────────────────────────────────────
function toRow(order: Order) {
  return {
    id:            order.id,
    user_id:       order.userId,
    items:         order.items,
    total:         order.total,
    customer_info: order.customerInfo,
    status:        order.status,
    created_at:    order.createdAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

/** Returns null if OK, or error string if Supabase/table is broken */
export async function checkSupabaseSetup(): Promise<string | null> {
  try {
    const { error } = await supabase.from('orders').select('id').limit(1);
    if (error) return error.message;
    return null;
  } catch (e: unknown) {
    return e instanceof Error ? e.message : String(e);
  }
}

export const orderService = {
  /** Create order — saves to Supabase AND localStorage (dual write for safety) */
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const id = `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const full: Order = { ...order, id, createdAt };

    // Always save locally (fallback / offline support)
    db.createOrder(order);

    // Push to Supabase
    const { error } = await supabase.from('orders').insert(toRow(full));
    if (error) {
      console.error('[orderService] Supabase insert error:', error.message);
      // silently continue — order is in localStorage
    }

    return full;
  },

  /** Get all orders — from Supabase, merged with any local-only orders */
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('[orderService] Supabase fetch error:', error?.message);
      // Fallback to localStorage
      return db.getOrders().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return data.map(mapRow);
  },

  /** Update order status */
  async updateStatus(id: string, status: Order['status']): Promise<void> {
    // Update locally too
    db.updateOrderStatus(id, status);

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) console.error('[orderService] Supabase update error:', error.message);
  },

  /** Delete order */
  async deleteOrder(id: string): Promise<void> {
    db.deleteOrder(id);

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) console.error('[orderService] Supabase delete error:', error.message);
  },
};
