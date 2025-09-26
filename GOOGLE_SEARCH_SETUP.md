# Google Custom Search Setup Guide

## Step 1: Create Google Custom Search Engine

1. **Go to Google Custom Search Console**
   - Visit: https://cse.google.com/cse/
   - Sign in with your Google account

2. **Create a New Search Engine**
   - Click "Add" or "Create a custom search engine"
   - Enter your website URL: `https://yourusername.github.io/repository-name`
   - Name your search engine: "Vineyard Elegance Wine Search"
   - Click "Create"

3. **Get Your Search Engine ID**
   - After creating, you'll see a "Search engine ID" (looks like: `012345678901234567890:abcdefghijk`)
   - Copy this ID - you'll need it for the next step

## Step 2: Update Your Website

1. **Replace the Search Engine ID**
   - Open `index.html` and `wine-bar.html`
   - Find this line: `<script async src="https://cse.google.com/cse.js?cx=YOUR_SEARCH_ENGINE_ID"></script>`
   - Replace `YOUR_SEARCH_ENGINE_ID` with your actual Search Engine ID
   - Example: `<script async src="https://cse.google.com/cse.js?cx=012345678901234567890:abcdefghijk"></script>`

2. **Configure Search Settings (Optional)**
   - Go back to your Google Custom Search Engine settings
   - Click "Setup" → "Basics"
   - Configure search features, appearance, and other options
   - You can customize the search box appearance, results layout, etc.

## Step 3: Test Your Search

1. **Deploy to GitHub Pages**
   - Push your changes to GitHub
   - Wait for GitHub Pages to update (usually 1-2 minutes)

2. **Test the Search**
   - Visit your live website
   - Try searching for terms like "wine", "bar", "construction"
   - Verify that results appear and are styled correctly

## Step 4: Advanced Configuration (Optional)

### Add More Sites to Search
- In Google Custom Search settings, go to "Setup" → "Sites to search"
- Add additional URLs if you have more pages
- You can also add related wine websites or blogs

### Customize Search Appearance
- Go to "Setup" → "Look and feel"
- Customize colors, fonts, and layout to match your website
- Enable/disable search features like image search, video search, etc.

### Add Search Analytics
- Go to "Setup" → "Advanced"
- Enable search analytics to see what people are searching for
- This helps you understand user behavior and improve content

## Troubleshooting

### Search Not Working?
1. **Check Search Engine ID**: Make sure you replaced `YOUR_SEARCH_ENGINE_ID` with the correct ID
2. **Wait for Indexing**: Google needs time to index your site (can take 24-48 hours)
3. **Check URL**: Ensure your GitHub Pages URL is correct in the search engine settings

### Styling Issues?
1. **Clear Browser Cache**: Hard refresh (Ctrl+F5) to see updated styles
2. **Check CSS**: The custom CSS should override Google's default styles
3. **Inspect Element**: Use browser dev tools to debug styling issues

### No Results Showing?
1. **Site Not Indexed**: Google needs to crawl your site first
2. **Wrong URL**: Make sure the URL in search engine settings matches your live site
3. **Content Issues**: Ensure your pages have enough text content for Google to index

## Benefits of Google Custom Search

✅ **Free to Use**: No cost for basic search functionality
✅ **Powerful Search**: Uses Google's advanced search algorithms
✅ **Cross-Page Search**: Searches across all your website pages
✅ **Customizable**: Matches your website's design and branding
✅ **Analytics**: See what visitors are searching for
✅ **Mobile Friendly**: Works perfectly on all devices
✅ **Fast Results**: Google's infrastructure ensures quick search results

## Alternative Search Options

If you prefer not to use Google Custom Search, you can also consider:

1. **Algolia Search**: More advanced features, free tier available
2. **Client-Side Search**: JavaScript-based search (only works on current page)
3. **Site Search**: Simple HTML-based search forms

## Support

If you need help with Google Custom Search setup:
- Google Custom Search Help: https://support.google.com/customsearch/
- Google Search Console: https://search.google.com/search-console/
