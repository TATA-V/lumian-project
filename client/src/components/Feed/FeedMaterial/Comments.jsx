import styled from 'styled-components';
import profileImg from '../../../assets/jpg-file/profile-img.jpg';
import thumbsUpFill from '../../../assets/svg-file/thumbs-up-fill.svg';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getCookie } from '../../Login/LoginMaterial/setCookie';
import verifiedIcon from '../../../assets/svg-file/moon-verified-icon.svg';

import CopyDeleteModal from './CopyDeleteModal';

const CommentsBlock = styled.li`
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--white-100);
`;

const Comment = styled.div`
  padding: 13px 0 13px 19px;

  .name-box {
    display: flex;
  }

  .verifi-moon {
    width: 10px;
    transform: translate(4px, -1px);
  }

  .right-icon-box {
    position: relative;
  }

  .more {
    color: var(--gray-blue-300);
    font-size: 13px;
    text-shadow: 0 0 0 var(--gray-blue-300);
  }

  .comments-author {
    display: flex;
    width: 745px;
    justify-content: space-between;
  }

  .user-img-txt {
    display: flex;
    margin-bottom: 7.5px;

    .profile-img {
      width: 32px;
      height: 32px;
      background: no-repeat url('${profileImg}');
      background-size: 32px 32px;
    }

    .user-txt {
      display: flex;
      justify-content: center;
      align-items: start;
      flex-direction: column;
      transform: translateX(8px);
    }

    .nickname {
      color: var(--dark-blue-900);
      font-size: 14px;
      font-weight: 700;
    }

    .time {
      color: var(--light-gray-500);
      font-size: 12px;
      text-shadow: 0 0 0 var(--light-gray-500);
      margin-top: 3px;
    }
  }

  .mini-menu {
    width: 26px;
    height: 26px;
    font-size: 16px;
    transform: translateX(-21px) translateY(-5px);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: var(--light-gray-100);
      transition: 0.15s;
    }

    i::before {
      color: var(--light-gray-400);
    }
  }

  .comments-content {
    color: var(--dark-blue-900);
    font-size: 15px;
    text-shadow: 0 0 0 var(--dark-blue-900);
    padding: 0 33px 0 40px;
    line-height: 21px;
  }

  .bottom-icon {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 7px 33px 0 36.5px;

    .thumbs-up {
      font-size: 16px;
      width: 26px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      &:hover {
        background-color: var(--light-gray-100);
        transition: 0.15s;
      }
      i:before {
        color: var(--light-gray-500);
      }
    }

    .thumbs-up-fill {
      width: 16px;
      transform: translateY(1px);
    }

    .num {
      color: var(--gray-600);
      font-size: 13px;
      text-shadow: 0 0 0 var(--gray-600);
    }

    .bubble {
      font-size: 16px;
      transform: translateX(8px);
      width: 26px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      &:hover {
        background-color: var(--light-gray-100);
        transition: 0.15s;
      }
      i:before {
        color: var(--light-gray-500);
      }
    }
  }
`;

// 댓글 컴포넌트임
const Comments = ({
  commentContentAll,
  setCommentContent,
  feedPostId,
  commentId,
  deleteModal,
  setDeleteModal,
  commentName,
  commentContent = '',
  likeNum,
  createAt,
  isArtist,
  artist,
}) => {
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(likeNum);
  const [openModal, setOpenModal] = useState(false);
  const [showAll, setShowAll] = useState(false); // 전체 내용 보여주는 여부

  const { currentUser, isUserFan } = useSelector((state) => state.user);
  const { groupId } = useParams();

  const clickMiniMenu = () => {
    setOpenModal(!openModal);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // 시간
  const formatTime = (time) => {
    const dateObj = new Date(time);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${month}. ${day}. ${hours}:${minutes}`;
  };
  const formattedTime = formatTime(createAt);

  const clickLike = (e) => {
    e.preventDefault();
    setLiked(!liked);

    if (!liked && !isArtist) {
      axios
        .post(
          `http://localhost:8080/feed/${groupId}/${feedPostId}/comment/${commentId}/like`,
          { fanId: currentUser.fanId },
          { headers: { Authorization: getCookie() } },
        )
        .then(() => {
          setLike(like + 1);
          setLiked(true);
        });
    }

    if (!liked && isArtist) {
      axios
        .post(
          `http://localhost:8080/feed/${groupId}/${feedPostId}/comment/${commentId}/like`,
          { fanId: currentUser.artistId },
          { headers: { Authorization: getCookie() } },
        )
        .then(() => {
          setLike(like + 1);
          setLiked(true);
        });
    }
  };

  return (
    <>
      <CommentsBlock>
        <Comment>
          <div className='comments-author'>
            <div className='user-img-txt'>
              <div className='profile-img'></div>
              <div className='user-txt'>
                <div className='name-box'>
                  <span className='nickname'>{isArtist ? artist.nickname : commentName}</span>
                  {isArtist && <img className='verifi-moon' src={verifiedIcon} alt='moon' />}
                </div>
                <span className='time'>{formattedTime}</span>
              </div>
            </div>
            <div className='right-icon-box'>
              <button onClick={clickMiniMenu} className='mini-menu'>
                <i className='i-three-point-menu-icon' />
              </button>
              {/* 게시글 수정, 삭제 모달 */}
              {openModal ? (
                <CopyDeleteModal
                  top='23%'
                  right='60%'
                  transform='translate(-21%, -13%)'
                  bgColor='rgba(0, 0, 0, 0.75)'
                  height='132'
                  radius='18px 18px 19.5px 19.5px'
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  deleteModal={deleteModal}
                  setDeleteModal={setDeleteModal}
                  what='댓글을'
                  commentContent={commentContent}
                  feedPostId={feedPostId}
                  commentId={commentId}
                  setCommentContent={setCommentContent}
                  commentContentAll={commentContentAll}
                />
              ) : null}
            </div>
          </div>
          <div className='comments-content'>
            {showAll ? (
              <p>{commentContent}</p>
            ) : (
              <>
                {commentContent.length > 650 ? (
                  <>
                    <div>
                      {commentContent.slice(0, 650)}...
                      <button className='more' onClick={toggleShowAll}>
                        more
                      </button>
                    </div>
                  </>
                ) : (
                  <p>{commentContent}</p>
                )}
              </>
            )}
          </div>
          <div className='bottom-icon'>
            <button onClick={clickLike} className='thumbs-up'>
              {liked ? (
                <div className='thumbs-up-fill'>
                  <img src={thumbsUpFill} alt='like' />
                </div>
              ) : (
                <i className='i-thumbs-up-icon' />
              )}
            </button>
            {like === 0 ? null : <span className='num'>{like}</span>}
            <button className='bubble'>
              <i className='i-bubble-icon' />
            </button>
          </div>
        </Comment>
      </CommentsBlock>
    </>
  );
};

export default Comments;
