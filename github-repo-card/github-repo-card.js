

class GithubRepoCard extends HTMLElement {
    constructor() {
        super();
        
        // Create a shadow root
        this.attachShadow({ mode: 'open' });
        
        // Initial render of loading state
        this.render('loading');
        
        // Fetch and render data
        this.fetchRepoData();
    }
    
    // Styles for the component
    static get styles() {
        return `
            .github-repo-card {
                --card-padding: 1.25rem;
                --card-bg: rgb(157, 66, 160);
                --card-radius: 1rem;
                --card-border: 0.1rem solid rgba(255, 255, 255, 0.1);
                --hover-scale: 1.05;
                --transition-speed: 0.4s;
                
                position: relative;
                width: 20rem;
                height: 18rem;
                padding: var(--card-padding);
                
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                
                background-color: var(--card-bg);
                border-radius: var(--card-radius);
                border: var(--card-border);
                
                color: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: all var(--transition-speed) ease;
                cursor: pointer;
            }

            .github-repo-card:hover {
                transform: scale(var(--hover-scale));
                box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
                border-color: white;
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1rem;
                min-height: 2.5rem;
            }

            h2 {
                font-size: 1.125rem;
                font-weight: 600;
                margin: 0;
                flex: 1;
                line-height: 1.3;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .user-image {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.2);
                transition: border-color var(--transition-speed) ease;
                object-fit: cover;
                flex-shrink: 0;
            }

            .repo-image-container {
                position: relative;
                width: 100%;
                height: 15rem;
                overflow: hidden;
                border-radius: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
            }

            .repo-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform var(--transition-speed) ease;
            }

            p {
                font-size: 0.9375rem;
                line-height: 1.5;
                color: rgba(255, 255, 255, 0.8);
                margin: 0;
                flex-grow: 1;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-height: 4.5em;
            }

            .repo-stats {
                display: flex;
                gap: 1rem;
                padding-top: 0.75rem;
                margin-top: auto;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .stat {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.7);
            }

            .loading {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: rgba(255, 255, 255, 0.7);
            }

            .error {
                padding: 1rem;
                color: #ff6b6b;
                text-align: center;
            }

            @keyframes pulse {
                0% { opacity: 0.6; }
                50% { opacity: 1; }
                100% { opacity: 0.6; }
            }

            .loading {
                animation: pulse 1.5s infinite;
            }
        `;
    }

    // Fetch repository data
    async fetchRepoData() {
        try {
            const owner = this.getAttribute('owner');
            const repo = this.getAttribute('repo');
            const customImage = this.getAttribute('img');

            if (!owner || !repo) {
                throw new Error('Owner and repo attributes are required');
            }

            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            
            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }

            const data = await response.json();
            this.render('success', { data, customImage });

        } catch (error) {
            console.error('Error fetching repository data:', error);
            this.render('error', { message: error.message });
        }
    }

    // Format numbers (e.g., 1000 -> 1k)
    formatNumber(num) {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num;
    }

    // Render the component
    render(state, data = {}) {
        const { shadowRoot } = this;

        // Add styles
        const style = document.createElement('style');
        style.textContent = GithubRepoCard.styles;
        shadowRoot.innerHTML = '';
        shadowRoot.appendChild(style);

        const card = document.createElement('div');
        card.className = 'github-repo-card';

        switch (state) {
            case 'loading':
                card.innerHTML = `
                    <div class="loading">Loading repository data...</div>
                `;
                break;

            case 'error':
                card.innerHTML = `
                    <div class="error">
                        <p>Error loading repository: ${data.message}</p>
                    </div>
                `;
                break;

            case 'success':
                const { data: repoData, customImage } = data;
                card.innerHTML = `
                    <div class="card-header">
                        <h2>${repoData.name}</h2>
                        <img class="user-image" src="${repoData.owner.avatar_url}" alt="${repoData.owner.login}">
                    </div>
                    
                    <div class="repo-image-container">
                        <img class="repo-image" src="${customImage}" alt="${repoData.name} preview">
                    </div>
                    
                    <p>${repoData.description || 'No description available'}</p>
                    
                    <div class="repo-stats">
                        <div class="stat">
                            <span>★</span>
                            <span>${this.formatNumber(repoData.stargazers_count)}</span>
                        </div>
                        <div class="stat">
                            <i class='bx bx-git-repo-forked' ></i>
                            <span>${this.formatNumber(repoData.forks_count)}</span>
                        </div>
                    </div>
                `;

                // Add click handler
                card.addEventListener('click', () => {
                    window.open(repoData.html_url, '_blank');
                });
                break;
        }

        shadowRoot.appendChild(card);
    }
}

// Define the custom element
customElements.define('github-repo-card', GithubRepoCard);  