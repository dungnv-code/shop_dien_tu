import WithBaseComponent from '../../../HOC/withBaseComponent'
const Mycart = (pops) => {

    console.log(pops)
    return (
        <div className="member-layout">
            <h1>Mycart</h1>
        </div>
    );
}

export default WithBaseComponent(Mycart);