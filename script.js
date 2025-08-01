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

      // Sort by most recent
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      posts.forEach((post) => {
        const postEl = document.createElement("a");
        postEl.href = post.file;
        postEl.className = "post-link";
        postEl.innerHTML = `
          <h3>${post.title}</h3>
          <p><strong>${post.author}</strong> &bull; ${post.date}</p>
        `;

        // Add to "Recent"
        postSections.Recent.appendChild(postEl.cloneNode(true));

        // Add to category
        const category = categories.includes(post.category) ? post.category : "Other";
        postSections[category].appendChild(postEl);
      });
    })
    .catch((err) => {
      postSections.Recent.innerHTML = `<p>Error loading posts: ${err.message}</p>`;
    });
});

