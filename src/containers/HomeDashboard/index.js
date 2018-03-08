import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { VictoryPie } from 'victory'
import { I18n } from 'react-i18nify'
import withGLPI from '../../hoc/withGLPI'
import Loading from '../../components/Loading'
import InfoBox from '../../components/InfoBox'
import { uiSetNotification } from '../../store/ui/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

function mapDispatchToProps(dispatch) {
  const actions = {
      setNotification: bindActionCreators(uiSetNotification, dispatch)
  }
  return { actions }
}

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      devices: undefined,
      fleets: undefined,
      invitations: undefined,
      files: undefined,
      applications: undefined,
      users: undefined,
      devicesByPlatform: undefined,
      pendingInvitations: undefined
    }
  }

  showError = (error) => {
    this.props.actions.setNotification({
      title: error[0],
      body: error[1],
      type: 'alert'
    })
  }

  getDevices = new Promise(async (resolve) => {
    try {
      const devices = await this.props.glpi.getAllItems({itemtype: "PluginFlyvemdmAgent"})
      const devicesAndroid = devices.filter(device => device.mdm_type === "android").length
      const devicesiOS = devices.filter(device => device.mdm_type === "ios").length
      const devicesWindows = devices.filter(device => device.mdm_type === "windows").length
      let devicesByPlatform = []
      if (devicesAndroid) devicesByPlatform.push({ x: 'Android', y: devicesAndroid })
      if (devicesiOS) devicesByPlatform.push({ x: 'Android', y: devicesiOS })
      if (devicesWindows) devicesByPlatform.push({ x: 'Android', y: devicesWindows })
      resolve({
        devices: devices.length,
        devicesByPlatform
      })
    } catch (error) {
      this.showError(error)
      resolve({})
    }
  })

  getInvitations = new Promise(async (resolve) => {
    try {
      const invitations = await this.props.glpi.getAllItems({itemtype: "PluginFlyvemdmInvitation"})
      resolve({
        invitations: invitations.length,
        pendingInvitations: invitations.filter(invitation => invitation.status === "pending").length
      })
    } catch (error) {
      this.showError(error)
      resolve({})
    }
  })

  getFleets = new Promise(async (resolve) => {
    try {
      const fleets = await this.props.glpi.getAllItems({itemtype: "PluginFlyvemdmFleet"})
      resolve({fleets: fleets.length})
    } catch (error) {
      this.showError(error)
      resolve({})
    }
  })

  getFiles = new Promise(async (resolve) => {
    try {
      const files = await this.props.glpi.getAllItems({itemtype: "PluginFlyvemdmFile"})
      resolve({files: files.length })
    } catch (error) {
      this.showError(error)
      resolve({})
    }
  })

  getApplications = new Promise(async (resolve) => {
    try {
      const applications = await this.props.glpi.getAllItems({itemtype: "PluginFlyvemdmPackage"})
      resolve({applications: applications.length })
    } catch (error) {
      this.showError(error)
      resolve({})
    }
  })

  getUsers = new Promise(async (resolve) => {
    try {
      const users = await this.props.glpi.getAllItems({itemtype: "User"})
      resolve({users: users.length })
    } catch (error) {
      this.showError(error)
      resolve({})
    }
  })

  componentDidMount = async () => {
    this.setState({
      ...await this.getDevices,
      ...await this.getInvitations,
      ...await this.getFleets,
      ...await this.getFiles,
      ...await this.getApplications,
      ...await this.getUsers,
      isLoading: false
    })
  }

  render() {
    const renderComponent = this.state.isLoading ? <div style={{width: '100%', height: 'calc(100vh - 80px)'}}><Loading message="Loading..." /></div>:
    (
      <React.Fragment>
        <div className="dashboard-block">

            <div className="dashboard-wrapper__div">

                <div className="dashboard-infobox-wraper__div">

                    <InfoBox
                      to='app/devices'
                      count={this.state.devices}
                      name={I18n.t('commons.devices')}
                      icon="deviceIcon"
                    />

                    <InfoBox
                      to='app/invitations'
                      count={this.state.invitations}
                      name={I18n.t('commons.invitations')}
                      icon="emailIcon"
                    />

                    <InfoBox
                      to='app/fleets'
                      count={this.state.fleets}
                      name={I18n.t('commons.fleets')}
                      icon="goToStartIcon"
                    />

                    <InfoBox
                      to='app/files'
                      count={this.state.files}
                      name={I18n.t('commons.files')}
                      icon="filesIcon"
                    />

                    <InfoBox
                      to='app/applications'
                      count={this.state.applications}
                      name={I18n.t('commons.applications')}
                      icon="switchAppsIcon"
                    />

                    <InfoBox
                      to='app/users'
                      count={this.state.users}
                      name={I18n.t('commons.users')}
                      icon="peopleIcon"
                    />

                </div>

                <div className="dashboard-chart-wraper__div">

                  <div key="DevicesOS" className="info-box">
                      <VictoryPie
                          colorScale={[
                            "#969696",
                            "#bdbdbd",
                            "#d9d9d9"
                          ]}
                          innerRadius={50}
                          padAngle={5}
                          labelRadius={90}
                          labels={(d) => `${d.x} ${d.y}`}
                          data={this.state.devicesByPlatform}
                          style={{ labels: { fill: "#000", fontSize: 24, fontWeight: 300 } }}
                      />
                      <span className="title-box">{I18n.t('commons.devices_by_plataform').toUpperCase()}</span>
                  </div>

                  <div key="InvitationsChart" className="info-box">
                    <VictoryPie
                        colorScale={[
                          "#969696",
                          "#bdbdbd",
                          "#d9d9d9"
                        ]}
                        innerRadius={50}
                        padAngle={5}
                        labelRadius={90}
                        labels={(d) => `${d.x} ${d.y}`}
                        data={[
                          { x: I18n.t('commons.invitations'), y: this.state.pendingInvitations }
                        ]}
                        style={{ labels: { fill: "#000", fontSize: 24, fontWeight: 300 } }}
                    />
                    <span className="title-box">{I18n.t('commons.pending_invitations').toUpperCase()}</span>
                  </div>

                </div>

            </div>

        </div>
      </React.Fragment>
    )

    return renderComponent
  }
}

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  glpi: PropTypes.object.isRequired
}

export default connect(
  null,
  mapDispatchToProps
)(withGLPI(Dashboard))