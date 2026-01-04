
import { supabase } from './customSupabaseClient';

const STORAGE_KEY = 'bio_link_data_v1';
const AUTH_KEY = 'bio_link_auth_v1'; // Legacy key, mostly unused now

// Default data for initialization/migration
export const defaultData = {
  profile: {
    name: "Antone Holmes",
    title: "Teacher & Coach",
    location: "United States",
    image: "https://horizons-cdn.hostinger.com/bed3f87d-420c-47ae-8b4d-deb0bd03d36c/d204b32c70f86dfc0314f64d5c3c19be.jpg",
    email: "antone@example.com",
    socials: [
      { id: 'medium', platform: 'Medium', url: '#' },
      { id: 'linkedin', platform: 'LinkedIn', url: '#' },
      { id: 'behance', platform: 'Behance', url: '#' }
    ]
  },
  sections: [
    { 
      id: 'book', 
      type: 'book', 
      title: "Featured Publication", 
      subtitle: "First Edition",
      isVisible: true,
      data: {
        title: "The New Man's Devotional",
        description: "\"If any man be in Christ, he is a new creature. Old things are passed away, behold, all things are become new.\" - 2 Corinthians 5:17",
        image: "https://horizons-cdn.hostinger.com/bed3f87d-420c-47ae-8b4d-deb0bd03d36c/887155913029f3787eb4016919bcfe33.png",
        url: "https://www.amazon.com/dp/B0FH9T3QRJ?ref_=ppx_hzsearch_conn_dt_b_fed_asin_title_23"
      }
    },
    { 
      id: 'writing', 
      type: 'writing', 
      title: "My Writing", 
      isVisible: true,
      data: {
        rssUrl: "https://medium.com/feed/@antoneh"
      }
    },
    { 
      id: 'creativity', 
      type: 'creativity', 
      title: "Recent Creations", 
      subtitle: "Click thumbnails to view output details",
      isVisible: true,
      data: {
        items: [
          {
            id: 1,
            title: "SaaS Dashboard UI",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
            alt: "Modern SaaS dashboard interface"
          },
          {
            id: 2,
            title: "E-commerce Platform",
            image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2064&auto=format&fit=crop",
            alt: "Clean e-commerce website layout"
          },
          {
            id: 3,
            title: "Fintech Mobile App",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
            alt: "Financial technology mobile app"
          }
        ]
      }
    },
    { 
      id: 'reading', 
      type: 'reading', 
      title: "What I'm Reading", 
      isVisible: true,
      data: {
        items: [
          {
            id: 1,
            title: "Atomic Habits",
            author: "James Clear",
            url: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
            image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop"
          },
          {
            id: 2,
            title: "The Creative Act",
            author: "Rick Rubin",
            url: "https://www.amazon.com/Creative-Act-Way-Being/dp/0593652886",
            image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2000&auto=format&fit=crop"
          },
          {
            id: 3,
            title: "Deep Work",
            author: "Cal Newport",
            url: "https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop"
          }
        ]
      }
    },
    { 
      id: 'links', 
      type: 'links', 
      title: "Connect", 
      isVisible: true,
      data: {
        links: [
           { id: '1', title: "LinkedIn", subtitle: "Professional profile & history", url: "#", icon: "LinkedIn" },
           { id: '2', title: "Behance", subtitle: "Design portfolio & case studies", url: "#", icon: "Behance" },
           { id: '3', title: "Medium", subtitle: "Articles, thoughts & essays", url: "#", icon: "Medium" }
        ]
      }
    }
  ]
};

// --- Synchronous Access (Legacy / Read-Only Components) ---
export const getSiteData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultData;
  }
  return JSON.parse(stored);
};

// --- Asynchronous Access (Supabase) ---

export const fetchAndSyncData = async () => {
  try {
    // 1. Fetch Profile
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profileError) throw profileError;

    // 2. Fetch Sections
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .order('position', { ascending: true });

    if (sectionsError) throw sectionsError;

    // 3. Check if empty (First run / Needs Migration)
    if (!profiles || profiles.length === 0 || !sections || sections.length === 0) {
      console.log('Supabase is empty. Migration needed.');
      return null; 
    }

    const profile = profiles[0];

    // 4. Construct Full Data Object
    const fullData = {
      profile: {
        id: profile.id, // Keep ID for updates
        name: profile.name,
        title: profile.title,
        location: profile.location,
        image: profile.image,
        email: profile.email,
        socials: profile.socials || []
      },
      sections: sections.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle,
        isVisible: s.is_visible,
        data: s.data
      }))
    };

    // 5. Update LocalStorage (Sync)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
    
    // Dispatch event so components listening to storage update
    window.dispatchEvent(new Event('storage-update'));

    return fullData;
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    return getSiteData(); // Fallback to local
  }
};

export const saveSiteData = async (data) => {
  try {
    // 1. Upsert Profile
    // We try to find the existing profile ID from data, or fetch the first one if missing
    let profileId = data.profile.id;
    if (!profileId) {
        const { data: existing } = await supabase.from('profiles').select('id').limit(1);
        if (existing && existing.length > 0) profileId = existing[0].id;
    }

    const profilePayload = {
        name: data.profile.name,
        title: data.profile.title,
        location: data.profile.location,
        image: data.profile.image,
        email: data.profile.email,
        socials: data.profile.socials,
        updated_at: new Date().toISOString()
    };
    
    // Only add ID if we have it, otherwise Supabase creates new UUID
    if (profileId) profilePayload.id = profileId;
    
    // If no profile exists, we need a password for the new row. 
    // But usually we migrate first. Assuming migration happens before save.
    const { data: savedProfile, error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload)
        .select()
        .single();
        
    if (profileError) throw profileError;

    // 2. Upsert Sections
    // We update all sections. To handle reordering, we update 'position'
    const sectionUpserts = data.sections.map((section, index) => ({
        id: section.id,
        type: section.type,
        title: section.title,
        subtitle: section.subtitle,
        is_visible: section.isVisible,
        data: section.data,
        position: index,
        updated_at: new Date().toISOString()
    }));

    const { error: sectionsError } = await supabase
        .from('sections')
        .upsert(sectionUpserts);

    if (sectionsError) throw sectionsError;

    // 3. Update LocalStorage
    const finalData = {
        ...data,
        profile: { ...data.profile, id: savedProfile.id }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
    window.dispatchEvent(new Event('storage-update'));

    return finalData;
  } catch (err) {
    console.error("Error saving to Supabase:", err);
    throw err;
  }
};

// --- Migration Tool ---
export const migrateLocalToSupabase = async () => {
    const localData = getSiteData();
    console.log("Migrating local data to Supabase...", localData);

    // 1. Create Profile
    const { data: profile, error: pError } = await supabase.from('profiles').insert({
        name: localData.profile.name,
        title: localData.profile.title,
        location: localData.profile.location,
        image: localData.profile.image,
        email: localData.profile.email,
        socials: localData.profile.socials,
        password: 'admin123' // Default password for migrated account
    }).select().single();

    if (pError) {
        console.error("Migration Profile Error", pError);
        throw pError;
    }

    // 2. Create Sections
    const sectionsPayload = localData.sections.map((s, i) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle,
        is_visible: s.isVisible,
        data: s.data,
        position: i
    }));

    const { error: sError } = await supabase.from('sections').insert(sectionsPayload);
    
    if (sError) {
        console.error("Migration Section Error", sError);
        throw sError;
    }

    // Update local storage with the new Profile ID
    const migratedData = { ...localData, profile: { ...localData.profile, id: profile.id } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));
    
    return migratedData;
};

// --- Auth ---
export const verifyPassword = async (password) => {
    // Check against Supabase
    const { data, error } = await supabase
        .from('profiles')
        .select('password')
        .limit(1);
    
    if (error || !data || data.length === 0) {
        // Fallback to local check if DB is empty or error
        // This allows login before first migration if needed
        const auth = localStorage.getItem(AUTH_KEY);
        const localPass = auth ? JSON.parse(auth).password : 'admin123';
        return password === localPass;
    }

    return data[0].password === password;
};

export const updatePassword = async (newPassword) => {
    // Update Supabase
    // We update all profiles found (should be only 1)
    const { error } = await supabase
        .from('profiles')
        .update({ password: newPassword })
        .gt('created_at', '2000-01-01'); // Dummy condition to update all rows
        
    if (error) throw error;
    
    // Update Local for fallback
    localStorage.setItem(AUTH_KEY, JSON.stringify({ password: newPassword }));
};

export const resetData = async () => {
    // DANGER: Clears DB tables and restores defaults
    // Used for "Reset Defaults" button in Admin
    
    // 1. Truncate tables (simulated by delete all)
    await supabase.from('sections').delete().neq('id', 'placeholder');
    await supabase.from('profiles').delete().neq('email', 'placeholder');
    
    // 2. Clear Local
    localStorage.removeItem(STORAGE_KEY);
    
    // 3. Re-run migration
    const newData = await migrateLocalToSupabase();
    return newData;
};
