import {useNavigate} from 'react-router-dom'

function ErrorPage() {
    const navigate = useNavigate();
  return (
    <>
        <h1>This page not exists</h1>
        <button onClick={()=>navigate("/")}>Go Back</button>
    </>
  );
}

export default ErrorPage