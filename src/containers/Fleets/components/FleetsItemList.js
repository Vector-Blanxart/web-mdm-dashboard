import React from 'react'

const FleetsItemList = ({itemList, history, clicked}) => {
    return (
        <div style={{ display: 'inline-block' }}>
            <div className="list-pane__name">{itemList["PluginFlyvemdmFleet.name"]}</div>
        </div>
    )
}

export default FleetsItemList