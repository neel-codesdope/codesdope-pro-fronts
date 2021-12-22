import { Skeleton, Table } from 'antd';

export const getParagraphSkeleton = () => <Skeleton active />;
export const getInputSkeleton = (size, w, h) => <Skeleton.Input size={size} style={{ width: w, height: h }} active />;
export const getAvatarSkeleton = (shape, w, h) => (
    <Skeleton.Avatar shape={shape} style={{ width: w, height: h }} active />
);
export const getImageSkeleton = () => <Skeleton.Image active />;
export const getButtonSkeleton = (size, shape) => <Skeleton.Button size={size} shape={shape} active />;
export const getCustomSkeleton = r => <Skeleton avatar paragraph={{ rows: r }} active />;

export const getTableSkeleton = (columns, rowCount) => {
    return (
        <Table
            rowKey='key'
            pagination={false}
            dataSource={[...Array(rowCount)].map((_, index) => ({
                key: `key${index}`
            }))}
            columns={columns.map(column => {
                return {
                    ...column,
                    render: function renderPlaceholder() {
                        return <Skeleton key={column.dataIndex} title={true} paragraph={false} />;
                    }
                };
            })}
        />
    );
};
