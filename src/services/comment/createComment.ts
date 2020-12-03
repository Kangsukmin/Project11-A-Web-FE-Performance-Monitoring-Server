import db from '@models';

const createComment = async (
  userId: string,
  issueId: string,
  description: string,
): Promise<void> => {
  const targetComment = await new db.Comment({
    userId,
    issueId,
    description,
  });
  const targetIssue = await db.Issue.findById(issueId);
  if (!targetIssue) {
    throw '찾는 이슈가 없습니다.';
  }
  const targetProject = await db.Project.findOne({
    _id: targetIssue.projectId,
    $or: [{ owner: userId }, { admins: userId }, { members: userId }],
  });
  if (!targetProject) {
    throw '당신의 프로젝트가 아닙니다.';
  }
  targetIssue.comments?.push(targetComment._id);
  await Promise.all([targetComment.save(), targetIssue.save()]);
};

export default createComment;
