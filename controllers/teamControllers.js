const mongoose = require('mongoose')
const User = mongoose.model('user')
const Team = mongoose.model('team')
const jwt = require('jsonwebtoken')
// const {checkUserExists, getUserFromToken} = require('./userControllers')
const getUserFromToken = async (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
    const userId = decodedToken._id;
    const user = await User.findById(userId);
    return user;
};
const checkUserExists = (user, res) => {
    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }
};

const teamControl = {
    createMateTeam: async (req, res) => {
        try {
            const {teamName, hashtag, description} = req.body;
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const newTeam = new Team({
                name: teamName,
                description: description,
                hashtag: hashtag,
                host: {
                    hostId: user._id,
                    hostName: user.name,
                },
                members: [user._id]

            });
            await newTeam.save();
            res.status(200).json({mgs: 'success'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getAllTeams: async (req, res) => {
        try {
            const teams = await Team.find({});
            const teamInfo = teams.map(team => ({
                _id: team._id,
                name: team.name,
                hashtag: team.hashtag,
                description: team.description,
                likes: team.likes.length,
                members: team.members.length
            }));

            res.json(teamInfo)
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    joinTeam: async (req, res) => {
        const {teamId} = req.body;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const team = await Team.findById(teamId);
            user.team.push(teamId);
            await user.save();
            team.members.push(user._id)
            await team.save();
            res.status(200).json({mgs: 'success'})
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    quitTeam: async (req, res) => {
        const {teamId} = req.params;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            await User.findOneAndUpdate(
                {_id: user._id},
                {$pull: {team: teamId}},
                {new: true}
            );
            const team = await Team.findById(teamId);
            const indexOfUserId = team.members.indexOf(user._id);
            team.members.splice(indexOfUserId, 1);
            await team.save();
            console.log()
            res.status(200).json({message: 'Success'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: error});
        }
    },
    deleteTeam: async (req, res) => {
        const {teamId} = req.params;
        try {
            await Team.deleteOne({_id: teamId});
            res.status(200).json({msg: 'success'})
        } catch (error) {
            console.error(error);
            res.status(500).json({error: error});
        }

    },
    getJoinedTeams: async (req, res) => {
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const myTeams = user.team.map(team => team.toString())
            const myTeamsSimple = await Team.find({_id: {$in: myTeams}});
            const myTeam = myTeamsSimple.map(team => ({
                _id: team._id,
                name: team.name,
                hashtag: team.hashtag,
                description: team.description,
                likes: team.likes.length,
                members: team.members.length
            }));
            res.status(200).json(myTeam);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getTeamInfo: async (req, res) => {
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const {teamId} = req.params;
            // const team=await Team.find({_id:teamId});
            const team = await Team.findById(teamId)
                .populate({
                    path: 'name'
                })
                .populate({
                    path: 'description',
                })
                .populate({
                    path: 'host',
                })
                .populate({
                    path: 'notice',
                    options: {limit: 3, sort: {_id: -1}} // 최근 3개의 공지 추출
                })
                .populate({
                    path: 'freeBoard',
                    options: {sort: {_id: -1}, limit: 1} // 최근 1개의 자유게시물 추출
                })
                .populate({
                    path: 'anonymousBoard',
                    options: {sort: {_id: -1}, limit: 1} // 최근 1개의 익명게시물 추출
                })
                .populate({
                    path: 'goal',
                    options: {sort: {_id: -1}, limit: 3} // 상위 3개의 목표 추출
                })
                .populate('members', '_id') // 팀 멤버의 수를 계산하기 위해 ID만 추출
                .populate({
                    path: 'chat',
                    match: {date: {$gte: new Date(new Date() - 12 * 60 * 60 * 1000)}} // 12시간 내의 채팅 리스트 추출
                })
                .exec();

            const teamInfo = {
                name: team.name,
                description: team.description,
                host: team.host.hostName,
                notice: team.notice.slice(team.notice.length - 3, team.notice.length).reverse(), // 최근 3개의 공지
                freeBoard: team.freeBoard, // 최근 1개의 자유게시물
                anonymousBoard: team.anonymousBoard, // 최근 1개의 익명게시물
                goal: team.goal,
                chatCount: team.chat.length, // 12시간 내의 채팅 리스트 길이
                memberCount: team.members.length // 팀 멤버 수
            };
            res.status(200).json(teamInfo);

        } catch (e) {
            console.error(e);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getTeamNotice: async (req, res) => {
        const {teamId} = req.params;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const notice = await Team.find({_id: teamId}, {notice: 1})
            res.status(200).json(notice[0].notice.reverse())
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }

    },
    postTeamNotice: async (req, res) => {
        const {teamId} = req.params;
        const {title, content} = req.body;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const team = await Team.findById(teamId);
            const newNotice = {
                noticeTitle: title,
                noticeContent: content,
                author: user.name,
                authorId: user._id
            }
            team.notice.push(newNotice);
            await team.save();
            res.status(200).json({msg: 'success'})
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    deleteTeamNotice: async (req, res) => {
        const {teamId, noticeId} = req.params;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);

            const team = await Team.findById(teamId).populate('notice')
            const notice = team.notice.find(notice => notice._id.toString() === noticeId)
            if (!notice) return res.status(404).json({msg: 'notice not found'})
            if (notice.authorId.toString() !== user._id.toString()) return res.status(403).json({msg: 'not authorized'})
            const indexOfNotice = team.notice.indexOf(notice)
            team.notice.splice(indexOfNotice, 1)
            await team.save()
            // console.log(indexOfNotice)
            res.status(200).json({msg: 'notice deleted success'})
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    updateTeamNotice: async (req, res) => {
        const {teamId, noticeId} = req.params;
        const {title, content} = req.body;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);

            const team = await Team.findById(teamId).populate('notice')
            const notice = team.notice.find(notice => notice._id.toString() === noticeId)
            if (!notice) return res.status(404).json({msg: 'notice not found'})
            notice.noticeTitle = title
            notice.noticeContent = content
            await team.save()
            console.log(notice.noticeTitle, notice.noticeContent, title, content)
            res.status(200).json({msg: 'success'})
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    postTeamBoard: async (req, res) => {
        const {teamId} = req.params;
        const {title, content, isAnonymous} = req.body;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const team = await Team.findById(teamId);
            let newBoard;
            if (isAnonymous) {
                newBoard = {
                    postTitle: title,
                    postContent: content,
                }
                team.anonymousBoard.push(newBoard);
            } else {
                newBoard = {
                    postTitle: title,
                    postContent: content,
                    author: user.name,
                    authorId: user._id
                }
                team.freeBoard.push(newBoard);
            }
            await team.save();
            console.log(newBoard, isAnonymous)
            res.status(200).json({msg: 'success'})

        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    deleteTeamBoard: async (req, res) => {
        const {teamId, boardId} = req.params;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);

            const team = await Team.findById(teamId).populate('freeBoard')
            const freeBoard = team.freeBoard.find(board => board._id.toString() === boardId)
            if (!freeBoard) return res.status(404).json({msg: 'board not found'})
            if (freeBoard.authorId.toString() !== user._id.toString()) return res.status(403).json({msg: 'not authorized'})
            const indexOfBoard = team.freeBoard.indexOf(freeBoard)
            team.freeBoard.splice(indexOfBoard, 1)
            await team.save()
            // console.log(indexOfBoard)
            res.status(200).json({msg: 'board deleted success'})
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }

    },
    updateTeamBoard: async (req, res) => {
        const {teamId, boardId} = req.params;
        const {title, content} = req.body;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const team = await Team.findById(teamId).populate('freeBoard')
            const freeBoard = team.freeBoard.find(board => board._id.toString() === boardId)
            if (!freeBoard) return res.status(404).json({msg: 'board not found'})
            freeBoard.postTitle = title
            freeBoard.postContent = content
            await team.save()
            console.log(freeBoard.postTitle, freeBoard.postContent, title, content)
            res.status(200).json({msg: 'success'})
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    getTeamBoard: async (req, res) => {
        const {teamId} = req.params;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const board = await Team.find({_id: teamId}, {freeBoard: 1, anonymousBoard: 1})
            res.status(200).json(board[0])
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    postBoardComment: async (req, res) => {
        const {teamId} = req.params;
        const {boardId, comment, isAnonymous} = req.body;
        try {
            const user = await getUserFromToken(req)
            checkUserExists(user, res);
            const team = await Team.findById(teamId)
            if (!team) return res.status(404).json({msg: 'team not found'})
            const board = await (isAnonymous ? team.anonymousBoard : team.freeBoard).find(board => board._id.toString() === boardId);
            if (!board) return res.status(404).json({msg: 'board not found'})
            const newComment = isAnonymous
                ? comment
                : {
                    user: user.name,
                    content: comment,
                    userId: user._id,
                };
            board.comments.push(newComment)
            await team.save()
            res.status(200).json({msg: 'success'})
        } catch (e) {
            console.error(e)
            res.status(500).json(e)
        }
    },
    deleteTeamBoardComment: async (req, res) => {
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const {teamId, boardId, commentId} = req.params;
            const team=await Team.findById(teamId).populate('freeBoard').populate('anonymousBoard')
            if(!team) return res.status(404).json({msg:'team not found'})

            const freeBoard = team.freeBoard.find(board => board._id.toString() === boardId)
            if(!freeBoard) return res.status(404).json({msg:'board not found'})

            const freeBoardComment=freeBoard.comments.find(comment=>comment._id.toString()===commentId)
            console.log(freeBoardComment._id, commentId)
            if(freeBoardComment._id.toString()!==commentId) return res.status(404).json({msg:'comment not found'})

            const indexOfComment=freeBoard.comments.indexOf(freeBoardComment)
            freeBoard.comments.splice(indexOfComment,1)
            await team.save()

            res.status(200).json({msg: 'success'})

        } catch (e) {
            console.error(e)
            res.status(500).json(e)
        }
    },
    getTeamMembers: async (req, res) => {
        const {teamId} = req.params;
        try {
            const team = await Team.findById(teamId)
            let members = await User.find({_id: {$ne: team.host.hostId, $nin: team.members}})
            members = members.map(member => ({
                _id: member._id,
                name: member.name,
                email: member.email,
                sex: member.sex,
                age: member.age,
                area: member.area,
            }))
            let host = await User.findById(team.host.hostId)
            host = {
                _id: host._id,
                name: host.name,
                email: host.email,
                sex: host.sex,
                age: host.age,
                area: host.area,
            }
            res.status(200).json({members, host})
        } catch (e) {
            console.error(e)
            res.status(500).json(e)
        }
    }

}

module.exports = teamControl;