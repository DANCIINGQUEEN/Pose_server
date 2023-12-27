# 운동메이트 Back-End(node.js 서버)

# **운동메이트** 배경
  고령화 사회가 되어가고 있는 지금 건강관리는 선택이 아닌 필수가 되어 가고 있습니다. 
  우리가 개발한 운동메이트 웹앱은 웹캠을 통해 실시간으로 사용자의 자세를 교정해줄 수 있습니다. 
  그리고 메이트들과 함께 하는 운동을 통해 운동에 대한 즐거움을 줍니다. 
  결과적으로 단기적인 운동이 아닌 장기적으로 운동을 할 수 있도록 동기부여를 줍니다. 

# **운동메이트** 과제 수행 결과
  운동 기록 저장되 메이트 팀 정보공유 기능을 통해 사용자가 혼자서 할 때 뿐만 아니라 메이트와 함께 운동 현황을 공유하며 동기부여를 받을 수 있도록 합니다

  
# 시스템 구성도
![system-diagram](./exec/system-diagram.png)


# **운동메이트** 서버 api

  - ### 유저 정보 api
    
    | api url | 기능 |
    | --- | --- |
    | /sendVerificationCode | 회원가입 시 유저의 이메일로 6자리 인증번호를 보냄 |
    | /verifyCode | 유저가 전달받은 6자리 인증번호를 인증 |
    | /registerSimpleUser | 세부 정보를 입력하지 않고 이메일, 비밀번호로만 회원가입 |
    | /registerDetailUser | 세부 정보를 입력하고 회원가입|
    | /login | 로그인 |
    | /getUserFullInfo | 로그인 시 유저 정보 전달 |
    | /getRecommendUsers | 팔로우 할 수 있는 메이트 리스트 전달 |
    | /followUser | 메이트 팔로우 |
    | /goalSetting | 운동 목표 설정 |
    | /getFollowers | 유저가 팔로우한 메이트 목록 전달 |
    | /getFollowing | 유저를 팔로잉하는 메이트 목록 전달 |
    | /updateProfile | 유저 정보 수정 |
    | /updateInformation | 유저 세부 정보 수정 |
    | /isPasswordCorrect | 유저 정보 수정 시 비밀번호 재확인 |
    | /updatePassword | 유저 비밀번호 수정 |
    | /getUnfollow | 메이트 언팔로우 |
    | /initialFollower | superuser가 특정 유저의 팔로우 리스트를 초기화 |
    | /initialGoal | superuser가 특정 유저의 운동 목표를 초기화 |
    | /uploadPost | 게시글 업로드(사진, 글) |
    | /deleteMyPost/:postId | 게시글 삭제 |
    | /updateMyPost/:postId | 게시글 수정 |
    | /getPosts | 팔로우한 메이트들의 게시글 피드 전달 |
    | /updateUserExerciseAttain | 운동 후 달성값 저장 |
    | /postUserPostComment | 게시글 댓글 등록 |
    | /deleteUserPostComment/:userId/:postId/:commentId | 게시글에 등록한 댓글 삭제 |
    | /initialUserPostComment | superuser가 특정 게시글의 댓글 삭제 |
    | /postUserPostHeart | 게시글 좋아요 등록 |
    | /deleteUserPost | superuser가 특정 유저의 게시글 삭제 |
    | /getMyPosts | 유저가 작성한 유저의 게시글 불러오기 |
    | /getFollowersExercisesStatus | 팔로우한 메이트들의 운동 상태 전달 |
    | /getOtherUserInfo/:userId | 타 유저들의 정보 확인 |
    | /getOtherUserFollowersFollowing | 타 유저들의 팔로우, 팔로잉 목록 전달 |
    | /updateInformationPublic | 유저의 세부 정보를 타 유저들에게 공개 여부 설정 |

  - ### 메이트 팀 api

    | api url | 기능 |
    | --- | --- |
    | /createTeam | 새로운 메이트 팀 만들기 |
    | /getAllTeams | 가입하지 않은 메이트 팀 목록 전달 |
    | /joinTeam | 메이트 팀 가입 |
    | /quitTeam/:teamId | 메이트 팀 탈퇴 |
    | /deleteTeam/:teamId | 메이트 팀 방장이 팀 삭제 |
    | /getJoinedTeams | 가입한팀 목록 전달 |
    | /getTeamInfo/:teamId | 특정 팀의 정보 전달 |
    | /postTeamNotice/:teamId | 특정 팀의 공지글 등록 |
    | /getTeamNotice/:teamId | 특정 팀의 공지글들 전달 |
    | /deleteTeamNotice/:teamId/:noticeId | 특정 팀에 유저가 작성한 공지글 삭제 |
    | /updateTeamNotice/:teamId/:noticeId | 특정 팀에 유저가 작성한 공지글 수정 |
    | /postTeamBoard/:teamId | 특정 팀의 게시판 글 등록(자유게시판, 익명게시판) |
    | /updateTeamBoard/:teamId/:boardId | 특정 팀에 유저가 작성한 게시글 수정|
    | /deleteTeamBoard/:teamId/:boardId | 특정 팀에 유저가 작성한 게시글 삭제 |
    | /getTeamBoard/:teamId | 특정 팀의 게시판 글 전달 |
    | /postTeamBoardComment/:teamId | 특정 팀의 게시판 게시글에 댓글 등록 |
    | /deleteTeamBoardComment/:teamId/:boardId/:commentId | 특정 팀의 게시판에 유저가 등록한 댓글 삭제 |
    | /getTeamMembers/:teamId | 특정 팀에 가입한 메이트 목록 전달 |
    | /getTeamMembersExerciseStatus/:teamId | 특정 팀에 가입한 메이트들의 운동 상대 전달 |
    | /getJoinedTeamInfo | 유저가 가입한 메이트 팀의 정보 전달 |
     

  ### 프로젝트 디렉터리 구조
```
  Node.js

  server
  ├─controllers
  │  ├─teamController.js
  │  ├─userController.js
  ├─routes
  │  ├─teams.js
  │  ├─users.js
  ├─models
  │  ├─team.js
  │  ├─user.js
  ├─views
  │  ├─error.jade
  │  ├─index.jade
  │  ├─layout.jade
  ├─public
  ├─app.js
  ├─package-lock.json
  └─package.json
```


# Conventions

## ⚙ 사용 기술

### :earth_africa: Environment

<div>
    <img src="https://img.shields.io/badge/Git-FFFFFF?style=flat&logo=Git&logoColor=F05032">
    <img src="https://img.shields.io/badge/Visual Studio Code-FFFFFF?style=flat&logo=visualstudiocode&logoColor=007ACC">
    <img src="https://img.shields.io/badge/InteliJ-FFFFFF?style=flat&logo=intellijidea&logoColor=000000">
</div>

<br />

### :pick: Development

<div>
    <img src="https://img.shields.io/badge/React-FFFFFF?style=flat&logo=react&logoColor=61DAFB">
    <img src="https://img.shields.io/badge/Firebase-FFFFFF?style=flat&logo=Firebase&logoColor=FFCA28">
    <img src="https://img.shields.io/badge/Vercel-FFFFFF?style=flat&logo=vercel&logoColor=009639">
</div>

<br />

### :mega: Communication

<div>
    <img src="https://img.shields.io/badge/Kakaotalk-FFFFFF?style=flat&logo=Mattermost&logoColor=0058CC">
</div>

<br />
