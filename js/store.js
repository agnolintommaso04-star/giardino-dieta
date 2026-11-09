// =====================================================================
//  STORE: salva i dati su Supabase (account) oppure in locale
// =====================================================================
const KINDS = ["meal", "recipe", "food", "note", "profile"];

const Store = {
  mode: "local",          // "local" | "cloud"
  client: null,
  user: null,
  cache: { meal: [], recipe: [], food: [], note: [], profile: [] },

  isConfigured() {
    const c = window.APP_CONFIG || {};
    return !!(c.SUPABASE_URL && c.SUPABASE_ANON_KEY && window.supabase);
  },

  initClient() {
    if (this.client || !this.isConfigured()) return this.client;
    const c = window.APP_CONFIG;
    this.client = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    return this.client;
  },

  uid() {
    return (crypto.randomUUID && crypto.randomUUID()) ||
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, ch => {
        const r = (Math.random() * 16) | 0;
        return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
  },

  // ---------- caricamento ----------
  async loadAll() {
    if (this.mode === "cloud") {
      const { data, error } = await this.client.from("items").select("id, kind, data");
      if (error) throw error;
      KINDS.forEach(k => (this.cache[k] = []));
      data.forEach(row => {
        if (this.cache[row.kind]) this.cache[row.kind].push({ ...row.data, id: row.id });
      });
      this._backupLocal();
    } else {
      const raw = localStorage.getItem("giardino_data");
      const parsed = raw ? JSON.parse(raw) : {};
      KINDS.forEach(k => (this.cache[k] = parsed[k] || []));
    }
  },

  _saveLocal() {
    if (this.mode === "local") localStorage.setItem("giardino_data", JSON.stringify(this.cache));
  },
  _backupLocal() {
    try { localStorage.setItem("giardino_cloud_cache", JSON.stringify(this.cache)); } catch (e) {}
  },

  // ---------- CRUD ----------
  list(kind) { return this.cache[kind]; },
  get(kind, id) { return this.cache[kind].find(x => x.id === id); },

  async save(kind, obj) {
    if (!obj.id) obj.id = this.uid();
    const arr = this.cache[kind];
    const i = arr.findIndex(x => x.id === obj.id);
    if (i >= 0) arr[i] = obj; else arr.push(obj);

    if (this.mode === "cloud") {
      const { id, ...data } = obj;
      const { error } = await this.client.from("items").upsert({ id, kind, data, user_id: this.user.id });
      if (error) throw error;
      this._backupLocal();
    } else this._saveLocal();
    return obj;
  },

  async remove(kind, id) {
    this.cache[kind] = this.cache[kind].filter(x => x.id !== id);
    if (this.mode === "cloud") {
      const { error } = await this.client.from("items").delete().eq("id", id);
      if (error) throw error;
      this._backupLocal();
    } else this._saveLocal();
  },

  // Carica in cloud i dati salvati in locale (dopo il primo login)
  async importLocalToCloud() {
    const raw = localStorage.getItem("giardino_data");
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    const rows = [];
    KINDS.forEach(k => (parsed[k] || []).forEach(o => {
      const { id, ...data } = o;
      if (k === "profile" && this.cache.profile.length) return; // non sovrascrivere il profilo cloud
      rows.push({ id: id || this.uid(), kind: k, data, user_id: this.user.id });
    }));
    if (!rows.length) return 0;
    const { error } = await this.client.from("items").upsert(rows);
    if (error) throw error;
    localStorage.removeItem("giardino_data");
    await this.loadAll();
    return rows.length;
  },

  exportJSON() {
    return JSON.stringify({ exportedAt: new Date().toISOString(), ...this.cache }, null, 2);
  },

  async importJSON(text) {
    const parsed = JSON.parse(text);
    for (const k of KINDS) {
      for (const o of parsed[k] || []) await this.save(k, o);
    }
  },
};

