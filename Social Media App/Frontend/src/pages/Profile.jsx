import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { dummyPostsData, dummyUserData } from '../assets/assets';
import Loading from '../components/Loading';
import UserProfileInfo from '../components/UserProfileInfo';
import PostCard from '../components/PostCard';
import moment from 'moment';
import ProfileModal from '../components/ProfileModal';

function Profile() {

  const { profileId } = useParams();

  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className='relative h-full p-6 overflow-y-scroll bg-gray-50'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='overflow-hidden bg-white shadow rounded-2xl'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {user.cover_photo && (<img src={user.cover_photo} alt='Cover Photo' className='object-cover w-full h-full' />)}
          </div>
          {/* User Info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>
        {/* Posts Tab */}
        <div className='mt-6'>
          <div className='flex max-w-md mx-auto bg-white shadow rounded-xl'>
            {
              ['posts', 'media', 'likes'].map((tab) => (
                <button onClick={() => setActiveTab(tab)} key={tab} className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))
            }
          </div>
          {/* Posts Content */}
          {activeTab === 'posts' && (
            <div className='flex flex-col items-center gap-6 mt-6'>
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          )}
          {/* Media */}
          {activeTab === 'media' && (
            <div className='flex flex-wrap max-w-6xl mt-6'>
              {
                posts.filter((post) => post.image_urls.length > 0).map((post) => (
                  <>
                    {post.image_urls.map((image, index) => (
                      <Link target='_blank' to={image} key={index} className='relative group'>
                        <img src={image} key={index} alt="" className='object-cover w-64 aspect-video' />
                        <p className='absolute bottom-0 right-0 p-1 px-3 text-xs text-white transition duration-300 opacity-0 backdrop-blur-xl group-hover:opacity-100'>Posted {moment(post.createdAt).fromNow()}</p>
                      </Link>
                    ))}
                  </>
                ))
              }
            </div>
          )}
        </div>
      </div>
      {/* Edit Profile Modal */}
      {showEdit && (<ProfileModal user={user} setShowEdit={setShowEdit} />)}
    </div>
  ) : (
    <Loading />
  )
}

export default Profile
