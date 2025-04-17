import QuestionsAndComments from '../chat';  

export default function QuestionsAndCommentsSection({ codeBlockId, userId, username }) {
  return (
    <div className="questions-section">
      <QuestionsAndComments 
        codeBlockId={codeBlockId} 
        userId={userId} 
        username={username} 
      />
    </div>
  );
}
