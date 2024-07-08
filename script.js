async function checkWebsite() {
    const url = document.getElementById('url-input').value;
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        // Image Count
        const images = doc.querySelectorAll('img');
        resultsDiv.innerHTML += `<div class="result-section">Number of Images: ${images.length}</div>`;

        // Language Check
        const lang = doc.documentElement.lang || 'Not specified';
        resultsDiv.innerHTML += `<div class="result-section">Language: ${lang}</div>`;

        // Media Files Check
        const mediaFiles = Array.from(doc.querySelectorAll('[src], [href]')).filter(el => el.src || el.href);
        resultsDiv.innerHTML += `<div class="result-section">Number of Media Files: ${mediaFiles.length}</div>`;

        // Styles Check
        const styles = window.getComputedStyle(doc.body);
        const fontStyles = styles.getPropertyValue('font-family');
        resultsDiv.innerHTML += `<div class="result-section">Font Styles: ${fontStyles}</div>`;

        // Experimental Checks
        const experimentalDiv = document.getElementById('experimental-results');
        experimentalDiv.innerHTML = '';

        // Safety Check (HTTP/HTTPS)
        const isHttps = url.startsWith('https');
        experimentalDiv.innerHTML += `<div class="result-section">HTTPS: ${isHttps}</div>`;

        // Ping Strength Check
        const start = performance.now();
        await fetch(url);
        const end = performance.now();
        const loadTime = end - start;
        experimentalDiv.innerHTML += `<div class="result-section">Load Time: ${loadTime.toFixed(2)} ms</div>`;

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch the website content');
    }
}
