// Dynamic robots.txt generation for ClassWeave
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/students/',
        '/saved-activities/',
        '/saved-stories/',
        '/edit-student/',
        '/add-student',
        '/past-activities',
        '/student-discarded-activities',
        '/saved-activity',
        '/under-construction',
        '/reset-password',
        '/forgot-password',
      ],
    },
    sitemap: 'https://classweave.vercel.app/sitemap.xml',
  };
}
