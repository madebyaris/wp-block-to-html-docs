import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { structuredData, organizationData, websiteData } from './structured-data'

// Enhanced theme with SEO features
export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Original VitePress theme enhanceApp
    if (DefaultTheme.enhanceApp) {
      DefaultTheme.enhanceApp({ app, router, siteData })
    }
    
    // Add structured data to the page when it loads in the browser
    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        addStructuredData()
      }
    }
  }
}

// Add JSON-LD structured data to the head
function addStructuredData() {
  if (typeof document === 'undefined') return
  
  // Remove any existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach(script => script.remove())
  
  // Add software application structured data
  const appDataScript = document.createElement('script')
  appDataScript.setAttribute('type', 'application/ld+json')
  appDataScript.textContent = JSON.stringify(structuredData)
  document.head.appendChild(appDataScript)
  
  // Add organization structured data
  const orgDataScript = document.createElement('script')
  orgDataScript.setAttribute('type', 'application/ld+json')
  orgDataScript.textContent = JSON.stringify(organizationData)
  document.head.appendChild(orgDataScript)
  
  // Add website structured data
  const websiteDataScript = document.createElement('script')
  websiteDataScript.setAttribute('type', 'application/ld+json')
  websiteDataScript.textContent = JSON.stringify(websiteData)
  document.head.appendChild(websiteDataScript)
}
