document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("posts-container");

  fetch("posts.json")
    .then((response) => {
      if (!response.ok) throw new Error("Could not load posts.json");
      return response.json();
    })
    .then((posts) => {
      if (posts.length === 0) {
        container.innerHTML = "<p>No news articles available yet.</p>";
        return;
      }

      posts.forEach((post) => {
        const postEl = document.createElement("a");
        postEl.href = post.file;
        postEl.className = "post-link";

        postEl.innerHTML = `
          <h3>${post.title}</h3>
          <p><strong>${post.author}</strong> &bull; ${post.date}</p>
        `;

        container.appendChild(postEl);
      });
    })
    .catch((error) => {
      container.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
    });
});

