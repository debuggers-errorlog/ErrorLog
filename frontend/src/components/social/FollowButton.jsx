import { useEffect, useState } from 'react';
import { getFollowStatus, toggleFollow } from '../../api/socialApi';
import { getCurrentUserId } from '../../utils/currentUser';
import { Button } from '../common/Styled';

// 작성자/유저 옆에 끼워넣어 쓰는 팔로우 버튼.
// 사용법:  <FollowButton targetUserId={작성자의_userId} />
export default function FollowButton({ targetUserId }) {
  const myId = getCurrentUserId();
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    if (!targetUserId) return;
    getFollowStatus(targetUserId)
      .then((s) => { setFollowing(s.following); setFollowerCount(s.followerCount); })
      .catch(() => { /* 비로그인 등 */ });
  }, [targetUserId]);

  // 대상이 없거나 본인이면 버튼을 숨김
  if (!targetUserId || myId === Number(targetUserId)) return null;

  async function handleClick() {
    if (!myId) { alert('로그인이 필요합니다.'); return; }
    try {
      const r = await toggleFollow(targetUserId);
      setFollowing(r.following);
      setFollowerCount(r.followerCount);
    } catch {
      alert('팔로우 처리에 실패했습니다.');
    }
  }

  return (
    <Button $variant={following ? 'secondary' : 'primary'} onClick={handleClick}>
      {following ? '팔로잉' : '팔로우'} · {followerCount}
    </Button>
  );
}
