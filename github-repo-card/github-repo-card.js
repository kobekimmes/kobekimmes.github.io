

class GHRepoCard extends HTMLElement {
    constructor() {
        super();
        // Create a shadow root
        const root = this.attachShadow({ mode: 'open' });
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', 'github-repo-card/github-repo-card.css');

        // Append the link element to the shadow root
        root.appendChild(styleLink);

        const container = document.createElement('div');

        //container.style.paddingLeft = 
        // container.style.display = "block";
        
        container.classList.add('github-repo-card');

        // Fetch repository data from the GitHub API
        const owner = this.getAttribute('owner');
        const repo = this.getAttribute('repo');
        const img = this.getAttribute('img');
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
            .then(response => response.json())
            .then(repoData => {
                // Create elements to display repository information
                const repoName = document.createElement('h2');
                repoName.textContent = repoData.name;

                const repoDescription = document.createElement('p');
                repoDescription.textContent = repoData.description;

                const usrImg = document.createElement('img');
                usrImg.src = repoData.owner.avatar_url
                usrImg.classList.add('user-image');
                
                const repoImg = document.createElement('img');
                repoImg.alt = "Custom image";
                repoImg.src = img;
                repoImg.classList.add('repo-image');
                
                const repoLink = document.createElement('a');
                repoLink.href = repoData.html_url;
                repoLink.target = '_blank';
                repoLink.style.textDecoration = 'none'; // Remove underline
            
                repoLink.classList.add('repo-link');


                // Append elements to the root
                container.appendChild(repoName);
                container.appendChild(usrImg);
                container.appendChild(repoDescription);
                container.appendChild(repoImg);
                container.appendChild(repoLink);

                container.addEventListener('click', (event) => {
                    
                    event.preventDefault();

                    window.open(repoLink.href, '_blank');
                });
            })
            .catch(error => {
                console.error('Error fetching repository data:', error);
            });

        root.appendChild(container);
    }
}

// Define the custom GitHub repository info element
customElements.define('github-repo-card', GHRepoCard);

// https://api.github.com/repos/kobekimmes/Emperor