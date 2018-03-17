import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentPane from '../../../components/ContentPane'
import Confirmation from '../../../components/Confirmation'
import Loading from '../../../components/Loading'

export default class FilesContent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }

    handleEdit = () => {
        const location = `${this.props.history.location.pathname}/edit`
        this.props.history.push(location)
    }

    handleDelete = async () => {
        try {
            const isOK = await Confirmation.isOK(this.contentDialog)
            if (isOK) {

                let itemListToDelete = this.props.selectedItems.map((item) => {
                    return {
                        id: item["PluginFlyvemdmFile.id"]
                    }
                })

                this.setState({
                    isLoading: true
                })

                await this.props.glpi.deleteItem({ itemtype: 'PluginFlyvemdmFile', input: itemListToDelete, queryString: { force_purge: true } })

                this.props.setNotification({
                    title: 'Successfully',
                    body: 'file successfully removed!',
                    type: 'success'
                })
                this.props.changeSelectionMode(false)
                this.props.changeAction("reload")
        
            } else {
                this.setState({
                    isLoading: false
                })
            }

        } catch (error) {
            if (error.length > 1) {
                this.props.setNotification({
                    title: error[0],
                    body: error[1],
                    type: 'alert'
                })
            } else {
                this.props.setNotification({
                    title: 'Error',
                    body: `${error}`,
                    type: 'alert'
                })
            }
            this.setState({
                isLoading: false
            })
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <ContentPane itemListPaneWidth={this.props.itemListPaneWidth} >
                    <Loading message="Loading..." />
                </ContentPane>
            )
        } else {
            return (
                <ContentPane itemListPaneWidth={this.props.itemListPaneWidth} updateAnimation={true} >
                    <div className="contentHeader">
                        <div className="itemInfo">
                            <span className="fileIcon" style={{ fontSize: '48px', paddingLeft: '20px', paddingTop: '20px' }} />
                            <div className="contentStatus">
                                <div className="name">{this.props.selectedItems[0]["PluginFlyvemdmFile.name"]}</div>
                                <br />
                                <span className="editIcon" style={{ marginRight: '20px' }} onClick={this.handleEdit} />
                                <span className="deleteIcon" onClick={this.handleDelete} />
                            </div>
                        </div>
                    </div>
                    <div className="separator" />
                    <Confirmation title={`Delete file`} message={this.props.selectedItems[0]["PluginFlyvemdmFile.name"]} reference={el => this.contentDialog = el} />
                </ContentPane>
            )
        }
    }
}
FilesContent.propTypes = {
    itemListPaneWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    selectedItems: PropTypes.array,
    changeAction: PropTypes.func.isRequired,
    changeSelectionMode: PropTypes.func.isRequired,
    setNotification: PropTypes.func.isRequired,
    glpi: PropTypes.object.isRequired
}