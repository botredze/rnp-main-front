const TableItem = (props) => {
    const { data } = props;

    return (
        <div className="tableItemMain">
            <div className="item">{data?.name}</div>
            <div className="articul">{data?.articul}</div>
            <div className="price">{data?.price}</div>
        </div>
    );
};
export default TableItem;
