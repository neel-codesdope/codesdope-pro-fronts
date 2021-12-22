import React from 'react';
import { Modal } from 'antd';
/**
 * Render a modal
 *
 */
export default function StatusModal(props) {
    return (
        <Modal
            title={null}
            mask={true}
            centered
            bodyStyle={{ padding: '35px', overflow: 'auto', backgroundColor: '#f5f5f5' }}
            width={props.width}
            visible={props.visible}
            footer={null}
            maskClosable={false}
            onCancel={props.onCancel}>
            {props.children}
        </Modal>
    );
}
