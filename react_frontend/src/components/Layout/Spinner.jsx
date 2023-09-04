
import Loader from '../../assets/spinner.svg'

export default function Spinner() {
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent: 'center'}}>
    <img src={Loader} width={30} height={30} alt="loading-animation" />
    </div>
  );
}