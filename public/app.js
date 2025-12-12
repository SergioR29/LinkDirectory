document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.getElementById('links-container');
    const addLinkForm = document.getElementById('add-link-form');

    // Fetch and display links
    const fetchLinks = async () => {
        try {
            const response = await fetch('/api/links');
            if (!response.ok) throw new Error('Failed to fetch links');
            const links = await response.json();
            renderLinks(links);
        } catch (error) {
            console.error(error);
            linksContainer.innerHTML = '<p class="loading">Error loading links. Please try again later.</p>';
        }
    };

    // Render links to the DOM
    const renderLinks = (links) => {
        linksContainer.innerHTML = '';

        if (links.length === 0) {
            linksContainer.innerHTML = '<p class="loading">No links found. Add one above!</p>';
            return;
        }

        // Sort by newest first (assuming higher ID is newer, or we can just reverse)
        // Here we just reverse based on ID/insert order logic if needed.
        // For now, let's show them in the order from DB (which puts new ones at end), so let's reverse to show newest first.
        const reversedLinks = [...links].reverse();

        reversedLinks.forEach(link => {
            const card = document.createElement('div');
            card.className = 'link-card';

            card.innerHTML = `
                <div>
                    <div class="link-category">${escapeHtml(link.category)}</div>
                    <div class="link-title">${escapeHtml(link.title)}</div>
                    <div class="link-url" title="${escapeHtml(link.url)}">${escapeHtml(link.url)}</div>
                </div>
                <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link-action">Visit Site &rarr;</a>
            `;

            linksContainer.appendChild(card);
        });
    };

    // Basic XSS protection
    const escapeHtml = (text) => {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Handle form submission
    addLinkForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addLinkForm);
        const newLink = {
            title: formData.get('title'),
            url: formData.get('url'),
            category: formData.get('category')
        };

        // UI feedback - change button text
        const submitBtn = addLinkForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newLink)
            });

            if (!response.ok) throw new Error('Failed to add link');

            // Clear form
            addLinkForm.reset();

            // Reload list
            await fetchLinks();

        } catch (error) {
            console.error(error);
            alert('Failed to add link. Please try again.');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Initial load
    fetchLinks();
});
