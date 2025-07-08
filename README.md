# Premium Products Store - E-commerce Website

A modern, SEO-optimized e-commerce website built with vanilla HTML, CSS, and JavaScript. This project demonstrates best practices for search engine optimization, accessibility, and performance in a client-side rendered application.

## 🚀 Features

- **SEO Optimized**: Comprehensive meta tags, structured data, and semantic HTML
- **Accessible**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- **Responsive Design**: Mobile-first approach with fluid typography
- **Performance Focused**: Lazy loading, preconnections, and optimized assets
- **PWA Ready**: Web app manifest and service worker capabilities

## 🔍 SEO Implementation

### Meta Tags & Open Graph

- Comprehensive meta tags for search engines
- Open Graph and Twitter Card support for social sharing
- Canonical URLs to prevent duplicate content
- Proper title and description optimization

### Structured Data (JSON-LD)

- Organization schema for business information
- Website schema with search functionality
- Product schema with ratings and pricing
- Breadcrumb navigation schema
- Order confirmation schema

### Technical SEO

- Semantic HTML5 elements (`header`, `main`, `section`, `article`, `nav`)
- Proper heading hierarchy (H1, H2, H3)
- XML sitemap (`/public/sitemap.xml`)
- Robots.txt file (`/public/robots.txt`)
- PWA manifest for app-like experience

### Performance Optimization

- Preconnect hints for external resources
- Lazy loading for images
- Optimized font loading with `font-display: swap`
- Compressed and minified assets
- Critical CSS inlined in HTML

## ♿ Accessibility Features

- Skip links for keyboard navigation
- ARIA labels and roles for screen readers
- Focus management and keyboard trap in modals
- High contrast colors meeting WCAG standards
- Form validation with proper error messaging
- Reduced motion support for users with vestibular disorders

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite for development and building
- **API**: Fake Store API for product data
- **Styling**: Modern CSS with custom properties and nesting
- **Icons**: Font Awesome for iconography

## 📁 Project Structure

```html
e-commerce/ ├── public/ │ ├── fonts/ # Custom web fonts │ ├── icons/ # Favicon
and app icons │ ├── sitemap.xml # SEO sitemap │ ├── robots.txt # Web crawler
instructions │ └── manifest.json # PWA manifest ├── src/ │ ├── main.js # Main
application logic │ └── style.css # Stylesheet with CSS nesting ├── index.html #
Main HTML file with meta tags ├── package.json # Dependencies and scripts ├──
vite.config.js # Vite configuration └── README.md # Project documentation
```

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Preview production build**:

   ```bash
   npm run preview
   ```

## 🔧 SEO Configuration

### Before deploying, update these files

1. **Replace domain placeholders** in:

   - `index.html` (meta tags and structured data)
   - `public/sitemap.xml`
   - `src/main.js` (structured data URLs)

2. **Add real social media preview image**

   - Create `/public/icons/social-preview.jpg` (1200x630px)

3. **Configure analytics** (optional):
   - Add Google Analytics or similar tracking code

### Important SEO Considerations

- **Content**: While this demo uses API data, real e-commerce sites should have unique, valuable content
- **URLs**: Implement proper routing for product pages (/product/id/slug)
- **Image optimization**: Use WebP format and proper alt text
- **Core Web Vitals**: Monitor and optimize for Google's performance metrics

## 📊 Performance Metrics

The project is optimized for:

- **First Contentful Paint (FCP)**: < 2 seconds
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## 🔍 SEO Checklist

- ✅ Semantic HTML structure
- ✅ Meta tags and Open Graph
- ✅ Structured data implementation
- ✅ Mobile-responsive design
- ✅ Fast loading times
- ✅ Accessible navigation
- ✅ Error handling and 404 pages
- ✅ XML sitemap
- ✅ Robots.txt
- ✅ HTTPS ready
- ✅ Social media optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Live Demo](https://your-domain.com)
- [GitHub Repository](https://github.com/gabrielatwell1987/e-commerce)

---

**Note**: This is a demonstration project. For production use, consider implementing server-side rendering (SSR) or static site generation (SSG) for better SEO performance, especially for product pages.
