/**
 * productService — syncs product overrides & custom products via Supabase.
 * Falls back to localStorage when Supabase tables are unavailable.
 */
import { supabase } from './supabase';
import { db, ProductOverride, CustomProduct } from './database';

let supabaseAvailable: boolean | null = null;

async function checkTables(): Promise<boolean> {
  if (supabaseAvailable !== null) return supabaseAvailable;
  try {
    const { error } = await supabase.from('product_overrides').select('id').limit(1);
    supabaseAvailable = !error;
  } catch {
    supabaseAvailable = false;
  }
  return supabaseAvailable;
}

/** Force recheck (e.g. after user creates tables) */
export function resetProductServiceCache() {
  supabaseAvailable = null;
}

// ── Product Overrides ────────────────────────────────────────────────────────

export const productService = {
  async getOverrides(): Promise<ProductOverride[]> {
    if (await checkTables()) {
      try {
        const { data, error } = await supabase.from('product_overrides').select('*');
        if (!error && data) {
          return data.map(r => ({
            id: r.id as string,
            price: r.price as number | undefined,
            badge: r.badge as string | undefined,
            hidden: r.hidden as boolean | undefined,
            name: r.name as string | undefined,
          }));
        }
      } catch { /* fall through */ }
    }
    return db.getProductOverrides();
  },

  async setOverride(override: ProductOverride): Promise<void> {
    // Always write locally for instant feedback
    db.setProductOverride(override);

    if (await checkTables()) {
      try {
        const { error } = await supabase.from('product_overrides').upsert({
          id: override.id,
          price: override.price ?? null,
          badge: override.badge ?? null,
          hidden: override.hidden ?? false,
          name: override.name ?? null,
        }, { onConflict: 'id' });
        if (error) console.error('[productService] override upsert error:', error.message);
      } catch (e) {
        console.error('[productService] override upsert exception:', e);
      }
    }
  },

  async deleteOverride(id: string): Promise<void> {
    db.deleteProductOverride(id);

    if (await checkTables()) {
      try {
        await supabase.from('product_overrides').delete().eq('id', id);
      } catch { /* ignore */ }
    }
  },

  // ── Custom Products ──────────────────────────────────────────────────────

  async getCustomProducts(): Promise<CustomProduct[]> {
    if (await checkTables()) {
      try {
        const { data, error } = await supabase.from('custom_products').select('*');
        if (!error && data) {
          return data.map(r => ({
            id: r.id as string,
            name: r.name as string,
            categoryKey: r.category_key as string,
            price: r.price as number,
            description: r.description as string,
            image: r.image as string,
            badge: r.badge as string | undefined,
            isNew: r.is_new as boolean | undefined,
            createdAt: r.created_at as string,
          }));
        }
      } catch { /* fall through */ }
    }
    return db.getCustomProducts();
  },

  async saveCustomProduct(product: Omit<CustomProduct, 'id' | 'createdAt'>): Promise<CustomProduct> {
    const saved = db.saveCustomProduct(product);

    if (await checkTables()) {
      try {
        await supabase.from('custom_products').insert({
          id: saved.id,
          name: saved.name,
          category_key: saved.categoryKey,
          price: saved.price,
          description: saved.description,
          image: saved.image,
          badge: saved.badge ?? null,
          is_new: saved.isNew ?? false,
          created_at: saved.createdAt,
        });
      } catch (e) {
        console.error('[productService] custom product insert exception:', e);
      }
    }

    return saved;
  },

  async deleteCustomProduct(id: string): Promise<void> {
    db.deleteCustomProduct(id);

    if (await checkTables()) {
      try {
        await supabase.from('custom_products').delete().eq('id', id);
      } catch { /* ignore */ }
    }
  },
};
