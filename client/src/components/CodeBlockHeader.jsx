export default function CodeBlockHeader({ title, description, studentCount }) {
    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>Students in room: {studentCount}</p>
      </div>
    );
  }
  