import QuizData from "./quizData/QuizData";
import QuizShow from "./components/quizShow/QuizShow";
function App() {
  return (
    <div  >
     <QuizShow quizData={QuizData}/>
    </div>
  );
}

export default App;
