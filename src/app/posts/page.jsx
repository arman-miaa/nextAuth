

export const getPosts = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    return data;
}

export default async function Posts() {
    const posts = await getPosts();
  return (
      <div className="grid grid-cols-4 gap-8">
          {
              posts.map((singlePost) => {
                  return (
                      <div key={singlePost.id}>
                          <p>{singlePost.title}</p>
                          <p>{ singlePost.body}</p>
                          
                      </div>
                  )
              })
          }
    </div>
  )
}
