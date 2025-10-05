import Header from '../components/Header'
import Post from '../components/Post/Post'
import CreatePost from '../components/CreatePost'
import Sidebar from '../components/Sidebar'
import Rightbar from '../components/Rightbar'


// Mock data for the posts, which would normally come from your API
const postsData = [
  {
    id: 1,
    authorName: 'Ankit Sharma',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    meta: 'posted in <a href="#" class="text-primary-blue hover:underline">Campus Events</a> • 2h ago',
    content: "So excited for the upcoming Alumni Meetup 2025 on campus! Who's planning to be there? It would be great to reconnect with old friends and make new connections. Let's make it a memorable one! 🎉"
  },
  {
    id: 2,
    authorName: 'Priya Singh',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    meta: 'posted in <a href="#" class="text-primary-blue hover:underline">Tech Careers</a> • 5h ago',
    content: "My team at Google is hiring Senior SDEs for our Bangalore office. The role involves working on large-scale distributed systems. KGP alumni referrals are highly encouraged. Feel free to DM me for details!"
  }
];

function Dashboard() {

  return (
      <main className="container mx-auto p-4 lg:p-8 grid grid-cols-1 sm:grid-cols-5 gap-8 items-start">
        <Sidebar />
        <section className="sm:col-span-3">
          <CreatePost />
          {postsData.map(post => (
            <Post
              key={post.id}
              authorName={post.authorName}
              authorAvatar={post.authorAvatar}
              meta={post.meta}
              content={post.content}
            />
          ))}
        </section>
        <Rightbar />
      </main>
  )
}

export default Dashboard
