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

        // Sort by newest first
        const reversedLinks = [...links].reverse();

        reversedLinks.forEach(link => {
            const card = document.createElement('div');
            card.className = 'link-card';

            // Safe Strings
            const safeCategory = escapeHtml(link.category);
            const safeTitle = escapeHtml(link.title);
            const safeUrl = escapeHtml(link.url);

            card.innerHTML = `
                <div>
                    <div class="link-category">${safeCategory}</div>
                    <div class="link-title">${safeTitle}</div>
                    <div class="link-url" title="${safeUrl}">${safeUrl}</div>
                </div>
                <div class="card-actions">
                    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="link-action">Visit Site &rarr;</a>
                    <button class="btn-delete" data-id="${link.id}">Delete</button>
                </div>
            `;

            linksContainer.appendChild(card);
        });

        // Add event listeners to new delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    };

    // Handle Delete
    const handleDelete = async (e) => {
        const id = e.target.dataset.id;
        if (!confirm('Are you sure you want to delete this link?')) return;

        const btn = e.target;
        const originalText = btn.textContent;
        btn.textContent = 'Deleting...';
        btn.disabled = true;

        try {
            const response = await fetch(`/api/links/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete');

            // Refresh list
            await fetchLinks();
        } catch (error) {
            console.error(error);
            alert('Failed to delete link.');
            btn.textContent = originalText;
            btn.disabled = false;
        }
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

            // Trigger confetti
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

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
