document.addEventListener("DOMContentLoaded", () => {
  const categories = ["Politics", "Economy", "Opinion", "Other"];
  const postSections = {
    Recent: document.getElementById("recent"),
    Politics: document.getElementById("Politics"),
    Economy: document.getElementById("Economy"),
    Opinion: document.getElementById("Opinion"),
    Other: document.getElementById("Other")
  };

  fetch("posts.json")
    .then((res) => res.json())
    .then((posts) => {
      if (posts.length === 0) {
        postSections.Recent.innerHTML += "<p>No news articles available.</p>";
        return;
      }

      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      posts.forEach((post) => {
        // Fetch article HTML to extract preview
        fetch(post.file)
          .then(res => res.text())
          .then(html => {
            // Create a temp DOM to parse
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Find first <p>
            let preview = "No preview available.";
            const firstP = doc.querySelector(".content p");
            if (firstP) {
              preview = firstP.textContent.trim();
              if (preview.length > 200) {
                preview = preview.substring(0, 197) + "...";
              }
            }

            const postEl = document.createElement("a");
            postEl.href = post.file;
            postEl.className = "post-card";
            postEl.innerHTML = `
              <h3>${post.title}</h3>
              <p class="meta"><strong>${post.author}</strong> &bull; ${post.date}</p>
              <p class="preview">${preview}</p>
            `;

            // Add to Recent
            postSections.Recent.appendChild(postEl.cloneNode(true));

            // Add to categories
            const categoryList = Array.isArray(post.category)
              ? post.category
              : [post.category];

            categoryList.forEach((cat) => {
              const validCat = categories.includes(cat) ? cat : "Other";
              if (postSections[validCat]) {
                postSections[validCat].appendChild(postEl.cloneNode(true));
              }
            });
          });
      });
    })
    .catch((err) => {
      postSections.Recent.innerHTML = `<p>Error loading posts: ${err.message}</p>`;
    });
});


