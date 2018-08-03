import React, { Component } from 'react';
import img from '../../../assets//images/eolic-energy.png';
import img1 from '../../../assets//images/active_turbine.png';
import * as Classes from './SiteMapView.css'
import { connect } from 'react-redux';
import * as svgCharts from 'svg-charts';
import T1 from '../../../assets//images/T1.png';
import T2 from '../../../assets//images/T2.png';
import T3 from '../../../assets//images/T3.png';
import T4 from '../../../assets//images/T4.png';
import { naturalSort } from '../../../services/utilityHelpers';
import * as ActionTypes from '../../../stores/actions/actions'
const MarkerWithLabel = require('markerwithlabel')(window.google.maps);




const InspectionStatus = {
    PENDING: 1,
    LOGGED: 2,
    UPLOADED: 3,
    REJECTED_BY_PM: 4,
    CLARIFICATION_REQUESTED: 5,
    CLARIFICATION_PROVIDED: 6,
    APPROVED: 7,
    PROCESSING: 8,
    PROCESSING_ERROR: 9,
    READY_FOR_REVIEW: 10,
    RELEASED_TO_CLIENT: 11,
    COMPLETED: 12,
    REJECTED_BY_CLIENT: 13,
    REJECTED_BY_ANALYST: 14,
    DISCARDED: 15
}
const TurbineStatus = {
    TURBINE_IN_PROJECT_BUT_NOT_ANALYZED_YET: 1,
    TURBINE_IN_FILTERED_OUT_PROJECT: 2,
    TURBINE_WITH_NO_DAMAGE: 3,
    TURBINE_IN_SITE_NO_PROJECT_RUNNING: 4,
    TURBINE_WITH_DAMAGES: 5
}

const Severities = {
    S1: 1,
    S2: 2,
    S3: 3,
    S4: 4,
    S5: 5
}

const SVG_META = 'data:image/svg+xml;charset=UTF-8,';


class SiteMapView extends Component {
    constructor(props) {
        super(props);
        this.googleChecker = this.googleChecker.bind(this);
        this.renderMap = this.renderMap.bind(this);
        this.settings = {};
        this.selectedProjects = [];
        this.markersInfoWindow = {};
        this.map = null
    }

    siteMapData = [];
    renderMap() {
        if (!this.props.isSingleSite) {
            const coords = { lat: 41.375885, lng: 2.177813 };
            var marker = {};
            const mapProp = {
                center: {
                    lat: coords.lat,
                    lng: coords.lng
                },
                zoom: 3,
                mapTypeId: window.google.maps.MapTypeId.SATELLITE
            };
            // create map instance
            if (this.refs.mapContainer) {
                var map = new window.google.maps.Map(this.refs.mapContainer, mapProp);
                const infoWindow = new window.google.maps.InfoWindow();
                var that = this;
                this.props.allSitesData.map(element => {
                    this.getSiteLatLongAsyc(element).then(latLong => {
                        if (latLong) {
                            var icon = {
                                url: element.DamageCount > 0 ? img : img1, // url
                                scaledSize: new window.google.maps.Size(25, 25), // scaled size
                            };

                            marker[element.SiteProfileId] = new window.google.maps.Marker({
                                position: { lat: latLong.lat(), lng: latLong.lng() },
                                title: element.SiteName,
                                icon: icon,
                            });
                            marker[element.SiteProfileId].setMap(map);

                            window.google.maps.event.addListener(marker[element.SiteProfileId], 'click', (function (t, i) {
                                infoWindow.setOptions({
                                    content: that.generateHtml(element, that),
                                    position: { lat: latLong.lat(), lng: latLong.lng() }
                                });
                                infoWindow.open(map);
                                if (element.DamageClassification.length > 0) {
                                    const makeChart = [];
                                    element.DamageClassification.forEach(el => {
                                        makeChart.push({
                                            label: el.Severity,
                                            value: el.SeverityCount,
                                            color: that.getcolor(el.Severity)
                                        });
                                    });
                                    setTimeout(() => {
                                        that.loadPieChart(element, makeChart);
                                    }, 100);
                                }
                            }));

                        } else {
                            //console.log('Geocode was not successful for the following reason: ' + status);
                        }

                    })
                })
            }
        } else {
            this.siteMapData = [];
            this.siteMapData = { ...this.props.singleSiteData };
            this.getSiteLatLongAsyc(this.siteMapData).then(latlong => {
                const mapProp = {
                    center: { lat: latlong.lat(), lng: latlong.lng() },
                    zoom: 12,
                    mapTypeId: window.google.maps.MapTypeId.SATELLITE,
                    fullscreenControlOptions: {
                        position: window.google.maps.ControlPosition.BOTTOM_RIGHT
                    },
                };
                this.map = new window.google.maps.Map(this.refs.mapContainer, mapProp);
                let triangleCoords = [];
                this.siteMapData.PolygonOrder.forEach(i => {
                    triangleCoords.push({
                        lat: i.Latitude,
                        lng: i.Longitude,
                        order: i.Order
                    });
                });
                // triangleCoords = naturalSort(triangleCoords,'order');
                const polygonObj = new window.google.maps.Polygon({
                    paths: triangleCoords,
                    fillOpacity: 0.1,
                    strokeWeight: 5,
                    clickable: false,
                    zIndex: 1,
                    editable: false,
                    strokeColor: 'white',
                    strokeOpacity: 1.0
                });
                polygonObj.setMap(this.map);
                this.markers = {};
                this.settings = {};
                this.settings = { ...this.props.filteredSettings };
                const siteProjects = { ...this.props.selectedProjects };
                this.selectedProjects = [];
                if (siteProjects) {
                    siteProjects.Projects.forEach(item => {
                        if (item.isSelected) {
                            this.selectedProjects.push(item.ProjectCode);
                        }
                    });
                }
                this.selectedProjects = this.selectedProjects || [];
                if (this.settings && this.selectedProjects) {
                    this.loadSitesMap(this.siteMapData, this.settings, this.selectedProjects);
                }
            });

        }
    }

    loadSitesMap(data, filters, selectedProjects) {
        if ((typeof data !== 'undefined') && (typeof filters !== 'undefined') && (typeof selectedProjects !== 'undefined')) {
            const turbines = data.Turbines;
            clearTimeout(this.loopMarker);
            this.loopMarker = setTimeout(() => {
                this.getFilteredTurbinesAsync(turbines, filters, selectedProjects);
            }, 300);
        }
    }

    getFilteredTurbinesAsync(turbines, filters, selectedProjects) {
        turbines = JSON.parse(JSON.stringify(turbines));

        /*turbines[2].Projects.splice(0, 8);
        turbines[6].Projects.splice(0, 4);
        turbines[7].Projects.splice(0, 4);*/
        // Variable declarations

        // All turbines which are in site and no project is running on them. white boundary circle T4 image
        const turbinesInSiteNoProjectRunning = [];
        // All turbines which got filtered out (by either of prj, severity or damage category) - solid grey circle T3 image
        const turbinesInSiteAndFilteredOut = [];
        // All turbines yet to be analyzed
        const turbinesInProjectButNotAnalyzed = [];
        // All turbines with no damages
        const turbinesWithNoDamages = [];
        // All turbines with damages even after applying all the project/severity/damage filters
        this.turbinesWithDamages = [];

        turbines.forEach(turbine => {

            if (turbine.Projects && turbine.Projects.length === 0) {
                turbinesInSiteNoProjectRunning.push(turbine);
            } else {
                if (selectedProjects.length > 0) {

                    // apply selected projects filter
                    turbine.Projects = turbine.Projects.filter(project => {
                        let isProjectSelected = false;
                        selectedProjects.forEach(selectedProject => {
                            if (selectedProject === project.ProjectCode) {
                                isProjectSelected = true;
                            }
                        });
                        return isProjectSelected;
                    });

                    // If no prj remaining after selected project filter put in turbinesInSiteProjectFilteredOut. solid grey circle.
                    if (turbine.Projects.length === 0) {
                        turbinesInSiteAndFilteredOut.push(turbine);
                    } else {

                        if (!turbine.Projects[0].TurbineReleasedDate && (turbine.Projects[0].TurbineStatusID === InspectionStatus.PENDING
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.LOGGED
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.UPLOADED
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.REJECTED_BY_PM
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.APPROVED
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.PROCESSING
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.PROCESSING_ERROR
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.READY_FOR_REVIEW
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.REJECTED_BY_ANALYST
                            || turbine.Projects[0].TurbineStatusID === InspectionStatus.DISCARDED)) {
                            turbinesInProjectButNotAnalyzed.push(turbine);
                        } else if (turbine.Projects[0].TurbineReleasedDate
                            && (turbine.Projects[0].TurbineStatusID === InspectionStatus.RELEASED_TO_CLIENT
                                || turbine.Projects[0].TurbineStatusID === InspectionStatus.CLARIFICATION_PROVIDED
                                || turbine.Projects[0].TurbineStatusID === InspectionStatus.CLARIFICATION_REQUESTED
                                || turbine.Projects[0].TurbineStatusID === InspectionStatus.COMPLETED
                                || turbine.Projects[0].TurbineStatusID === InspectionStatus.REJECTED_BY_CLIENT)) {
                            // coming to this block means all the projects have a release date.

                            // Check for no defects
                            let damageFound = false;
                            turbine.Projects.forEach(project => {
                                if (!damageFound) {
                                    if (project.SeverityByBlade && project.SeverityByBlade.length > 0) {
                                        project.SeverityByBlade.forEach(blade => {
                                            if (!damageFound) {
                                                if (blade.HighestSeverity) {
                                                    damageFound = true;
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                            if (!damageFound) {
                                turbinesWithNoDamages.push(turbine);
                            } else {
                                // coming to this block means there is surely some damages reported.

                                // apply selected damage & severity filter
                                damageFound = false;
                                turbine.Projects.forEach(project => {
                                    project.SeverityByBlade.forEach(blade => {

                                        // damage filter applied
                                        blade.DamageDetails = blade.DamageDetails.filter(damage => {
                                            let isDamageCategoryPresent = false;
                                            if (filters) {
                                                filters.SelectedDamageType.forEach(selectedDamage => {
                                                    if (damage.Category === selectedDamage.DamageTypeName && !isDamageCategoryPresent) {
                                                        isDamageCategoryPresent = true;
                                                    }
                                                });
                                            }
                                            return isDamageCategoryPresent;

                                        });

                                        /*
                                         * If blade still has damages then apply severity filter
                                         */
                                        if (blade.DamageDetails.length > 0) {
                                            blade.DamageDetails = blade.DamageDetails.filter(damage => {
                                                damage.Sevirity = damage.Sevirity.filter(severity => {
                                                    let isSeverityPresent = false;
                                                    if (filters) {
                                                        filters.SelectedSeverity.forEach(selectedSeverity => {
                                                            if (severity.Severity === selectedSeverity.severityName && !isSeverityPresent) {
                                                                isSeverityPresent = true;
                                                            }
                                                        });
                                                    }
                                                    return isSeverityPresent;
                                                });
                                                // if no severity object remains then filter out the damage object as well.
                                                return damage.Sevirity.length > 0 ? true : false;
                                            });
                                        }

                                        if (!damageFound && blade.DamageDetails.length > 0) {
                                            damageFound = true;
                                        }

                                    });
                                });

                                // Check if any damage remaining after applying damage filter
                                if (!damageFound) {
                                    turbinesInSiteAndFilteredOut.push(turbine);
                                } else {
                                    // still damages are left after applying damage filter now lets apply severity filter.
                                    this.turbinesWithDamages.push(turbine);

                                    // Initialize the severity count and color on each turbine
                                    const severityCount = [
                                        {
                                            Severity: 'S5',
                                            SeverityCount: 0,
                                            SeverityColor: this.getcolor('S5')
                                        },
                                        {
                                            Severity: 'S4',
                                            SeverityCount: 0,
                                            SeverityColor: this.getcolor('S4')
                                        },
                                        {
                                            Severity: 'S3',
                                            SeverityCount: 0,
                                            SeverityColor: this.getcolor('S3')
                                        },
                                        {
                                            Severity: 'S2',
                                            SeverityCount: 0,
                                            SeverityColor: this.getcolor('S2')
                                        },
                                        {
                                            Severity: 'S1',
                                            SeverityCount: 0,
                                            SeverityColor: this.getcolor('S1')
                                        },
                                    ];
                                    turbine.Projects.forEach(project => {
                                        turbine.highestSeverity = [];
                                        turbine.severityCount = [];
                                        const severityArr = [];
                                        project.SeverityByBlade.forEach(blade => {
                                            severityArr.push({ Blade: blade.Blade, HighestSeverity: blade.HighestSeverity });
                                            blade.DamageDetails.forEach(damage => {
                                                damage.Sevirity.forEach(severity => {
                                                    const index = severityCount.findIndex(res => severity.Severity === res.Severity);
                                                    if (index !== -1) {
                                                        severityCount[index].SeverityCount = severityCount[index].SeverityCount + severity.SeverityCount;
                                                    }
                                                });
                                            });
                                        });
                                        turbine.highestSeverity.push({ project: project.ProjectName, severity: severityArr });
                                    });
                                    turbine.severityCount.push(severityCount);
                                }
                            }
                        }
                    }
                } else {
                    turbine.Projects = [];
                    turbinesInSiteAndFilteredOut.push(turbine);
                }
            }

        });
        this.getDamageSummaryData();

        if (turbinesInSiteNoProjectRunning.length > 0) {
            this.loadTurbinesIntoMap(turbinesInSiteNoProjectRunning, TurbineStatus.TURBINE_IN_SITE_NO_PROJECT_RUNNING);
        }
        if (turbinesInSiteAndFilteredOut.length > 0) {
            this.loadTurbinesIntoMap(turbinesInSiteAndFilteredOut, TurbineStatus.TURBINE_IN_FILTERED_OUT_PROJECT);
        }
        if (turbinesWithNoDamages.length > 0) {
            this.loadTurbinesIntoMap(turbinesWithNoDamages, TurbineStatus.TURBINE_WITH_NO_DAMAGE);
        }
        if (turbinesInProjectButNotAnalyzed.length > 0) {
            this.loadTurbinesIntoMap(turbinesInProjectButNotAnalyzed, TurbineStatus.TURBINE_IN_PROJECT_BUT_NOT_ANALYZED_YET);
        }
        if (this.turbinesWithDamages.length > 0) {
            this.loadTurbinesIntoMap(this.turbinesWithDamages, TurbineStatus.TURBINE_WITH_DAMAGES);
        }
        if (this._selectedTurbines) {
            clearTimeout(this.loop);
            this.loop = setTimeout(() => {
                this.makeDamageIconZoomOnMap(this._selectedTurbines);
            }, 100);
        }
    }

    loadTurbinesIntoMap(turbines, type) {
        // return Promise<any>(resolve => {
        const that = this;
        let pieData;

        if (type === TurbineStatus.TURBINE_WITH_DAMAGES) {
        }


        turbines.forEach(turbine => {
            pieData = { values: [], colors: [], icons: [], radius: 10, stroke: 1, strokeSize: 3, strokeColor: '' };
            if (type === TurbineStatus.TURBINE_WITH_DAMAGES) {
                turbine.severityCount[0].forEach(el => {
                    if (el.Severity === 'S5' && el.SeverityCount > 0) {
                        pieData.strokeColor = 'red';
                    }
                    if (el.SeverityCount > 0) {
                        pieData.values.push(el.SeverityCount);
                        pieData.colors.push(el.SeverityColor);
                    }
                });
            }
            let labelContent = null;
            if (turbine.Projects) {
                //turbine.Projects = naturalSort(turbine.Projects,'ProjectCode');
                turbine.Projects.forEach(project => {
                    if (this.selectedProjects.indexOf(project.ProjectCode) > -1) {
                        if (labelContent) {
                            labelContent = labelContent + ', ' + project.ProjectCode;
                        } else {
                            labelContent = project.ProjectCode;
                        }
                    }
                });
            }

            if (!that.markers[turbine.TurbineId]) {
                if (labelContent) {
                    that.markers[turbine.TurbineId] = new MarkerWithLabel({
                        map: that.map,
                        // animation: google.maps.Animation.DROP,
                        position: { lat: turbine.Latitude, lng: turbine.Longitude },
                        icon: this.getIcon(type, pieData),
                        title: turbine.TurbineId,
                        labelContent: labelContent,
                        labelAnchor: new window.google.maps.Point(22, -4), // increase the negative value to increase/decrease the label height from the marker
                        labelClass: 'marker-label', // the CSS class for the label
                        labelInBackground: true
                    });
                } else {
                    that.markers[turbine.TurbineId] = new window.google.maps.Marker({
                        position: { lat: turbine.Latitude, lng: turbine.Longitude },
                        title: turbine.TurbineId,
                        icon: this.getIcon(type, pieData),
                    });
                }

            } else {
                if (labelContent) {
                    that.markers[turbine.TurbineId].setIcon(this.getIcon(type, pieData));
                    if (that.markers[turbine.TurbineId].label) {
                        that.markers[turbine.TurbineId].labelClass = "marker-label";
                        that.markers[turbine.TurbineId].labelContent = labelContent;
                        that.markers[turbine.TurbineId].label.setContent();
                    }
                } else {
                    that.markers[turbine.TurbineId].setIcon(this.getIcon(type, pieData));
                    if (that.markers[turbine.TurbineId].label) {
                        that.markers[turbine.TurbineId].labelContent = "";
                        that.markers[turbine.TurbineId].labelClass = "marker-label-no-border";
                        that.markers[turbine.TurbineId].label.setContent();
                    }

                }
            }
            that.markers[turbine.TurbineId].setMap(this.map);
            window.google.maps.event.clearListeners(that.markers[turbine.TurbineId], 'click');
            if (that.markersInfoWindow[turbine.TurbineId]) {
                that.markersInfoWindow[turbine.TurbineId].close();
                that.markers[turbine.TurbineId].open = false;
            }
            if (type === TurbineStatus.TURBINE_WITH_DAMAGES) {
                window.google.maps.event.addListener(that.markers[turbine.TurbineId], 'click', (function (t, i) {
                    if (that.markersInfoWindow[turbine.TurbineId]) {
                        that.markersInfoWindow[turbine.TurbineId].close();
                        that.markers[turbine.TurbineId].open = false;
                    }
                    // if (!that.markers[turbine.TurbineId].open) {
                    const turbineData = that.getturbineData(turbine);
                    that.markersInfoWindow[turbine.TurbineId] = new window.google.maps.InfoWindow();
                    that.markersInfoWindow[turbine.TurbineId].setOptions({
                        content: that.generateTurbineHtml(turbineData),
                        position: { lat: t.Latitude, lng: t.Longitude }
                    });
                    that.markersInfoWindow[turbine.TurbineId].open(that.map, that.markers[turbine.TurbineId]);
                    that.markers[turbine.TurbineId].open = true;
                    setTimeout(() => {
                        that.loadPieChartByTurbine(turbineData);
                    }, 100);
                    // }
                }));
            }
        });
    }

    getIcon(type, pieData) {
        let icon;
        let iconProp;
        let scaledSize = new window.google.maps.Size(20, 20);
        switch (type) {
            case TurbineStatus.TURBINE_WITH_DAMAGES:
                if (pieData && pieData.values.length > 1) {
                    if (pieData.strokeColor === '') {
                        icon = SVG_META
                            + svgCharts().generatePieChartSVG(pieData.values, pieData.colors, pieData.radius, pieData.stroke);
                    } else {
                        icon = SVG_META
                            + svgCharts().generatePieChartSVG(pieData.values, pieData.colors, pieData.radius, pieData.strokeSize, pieData.strokeColor);
                    }

                } else if (pieData && pieData.values.length === 1) {
                    icon = SVG_META
                        + svgCharts().generatePieChartSVG(pieData.values, pieData.colors, pieData.radius, pieData.strokeSize, pieData.colors[0]);
                } else {
                    icon = SVG_META
                        + svgCharts().generatePieChartSVG([], [], pieData.radius, pieData.stroke);
                }
                scaledSize = null;
                break;
            case TurbineStatus.TURBINE_IN_PROJECT_BUT_NOT_ANALYZED_YET:
                icon = T2;
                break;
            case TurbineStatus.TURBINE_IN_FILTERED_OUT_PROJECT:
                icon = T3;
                break;
            case TurbineStatus.TURBINE_IN_SITE_NO_PROJECT_RUNNING:
                icon = T4;
                break;
            case TurbineStatus.TURBINE_WITH_NO_DAMAGE:
                icon = T1;
                break;
            default:
                break;
        }
        if (scaledSize) {
            iconProp = {
                url: icon,
                scaledSize: scaledSize
            };
        } else {
            iconProp = {
                url: icon
            };
        }
        return iconProp;
    }

    generateHtml(data) {
        let html;

        html = `<div class="mappopover">
        <div class="mappopoverinfo">
          <div class="onclickpopover">
            <div class="onclickpopoverinner">
              <div class="onclickpopovergraph">
                <div class="onclickgraphimg">
                  <div class="onclickgraphtitle">${data.SiteName}</div>`;


        html += `<div class="table-responsive">
                    <table class="table table-sm tooltiptableright table-bordered">
                      <tbody>
                        <tr>
                          <td>Projects</td>
                          <td>${data.ProjectCount}</td>
                        </tr>
                        <tr>
                          <td>Turbines</td>
                          <td>${data.TurbinesCount}</td>
                        </tr>
                        <tr>
                          <td>Damages Found</td>
                          <td>${data.DamageCount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div class="onclickgraphinfotooltip">
                <div class="onclickgraphtitle">${data.Address}</div>
                <div class="summarygraph">
                  <div class="">
                    <div class="col-sm-12 col-md-12 col-lg-7">`;
        if (data.DamageClassification.length > 0) {
            let count = 0;
            data.DamageClassification.forEach(el => {
                count += el.SeverityCount;
            });
            html += `<div  id="pieChart-${data.SiteProfileId}"></div>`;
        } else {
            html += `<div class=${Classes.Nodamagefoundmap}>No Damage Found</div>`;
        }

        html += `</div>
                  </div>
                </div>
              </div>
              `;


        html += `</div>
                  </div>
    
                </div>
                
                </div>
                </div>
               `;
        return html;

    }

    generateTurbineHtml(data) {
        let html = '<div id="divProjectInfoWindow" class="col-md-12">';
        if (data) {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];

                html += `
                <div class="mappopover mappopoverclasstwo">
                <div class="mappopoverinfo">
                  <div class="onclickpopover">
                    <div class="onclickpopoverinner">
                     <div class="onclickpopovertitle">
                      <div class="onclickpopovertext"><span>${element.TurbineId}</span><br>
                      <span>${element.LatLOng}</span></div>
                    <div class="onclickpopoverbtn">
                        <button class="btn readyforreviewbtn">${element.Status}</button>
                    </div>
                  </div>
                  <div class="onclickpopovergraph">
                    <div class="onclickgraphimg">
                    <div class="mapdonetview">
                      <div class="onclickgraphtitle"># Damages Detected By Severity</div>
                      <div class="onclickgraphimage">
                        <div id="pie-${element.ProjectCode + element.TurbineId}" >
                        </div>
                      </div>
                      </div>
                    <div class="onclickgraphinfo">
                      <div class="onclickgraphtitle"># Severity By Blade</div>
                      <div class="table-responsive">
                        <table class="table table-sm tooltiptable">
                            <thead>
                              <tr>
                                <th>
                                  <span class="tablecolorcircle"></span>
                                </th>
                                <th>
                                  <span class="tablecolorcircle"></span>
                                </th>
                                <th>
                                  <span class="tablecolorcircle"></span>
                                </th>
                                <th>
                                  <span class="tablecolorcircle"></span>
                                </th>
                                <th>
                                  <span class="tablecolorcircle"></span>
                                </th>
                                <th>
                                  <span class="tablecolorcircle"></span>
                                </th>
                                <th class="tablecolorcircle">#</th>
        
                              </tr>
                            </thead>
                            <tbody>`;
                element.SeveritiesByBlade.forEach(element => {
                    html += `<tr>
                          <td>${element.Blade}</td>
                          <td>${element.S5 ? element.S5 : 0}</td>
                          <td>${element.S4 ? element.S4 : 0}</td>
                          <td>${element.S3 ? element.S3 : 0}</td>
                          <td>${element.S2 ? element.S2 : 0}</td>
                          <td>${element.S1 ? element.S1 : 0}</td>
                          <td>${element.S1 + element.S2 + element.S3 + element.S4 + element.S5}</td>
                          </tr>
                        `;
                });
                html += `
                        </tbody>
                    </table>
                  </div>
                        </div>
                        
                      </div>
                      
                    </div>
                    
                  </div>
     
                </div>
                </div>
              </div>
             
         `;

            }
            html += '</div>';
            return html;
        }
    }

    loadPieChart(element, makeChart1) {
        if (element.DamageClassification.length > 0) {
            let count = 0;
            element.DamageClassification.forEach(el => {
                count += el.SeverityCount;
            });
            this.pie = window.d3pie(`pieChart-${element.SiteProfileId}`, {
                'header': {
                    'title': {
                        'text': count,
                        'fontSize': 16,
                        'font': 'open sans'
                    },
                    'location': 'pie-center',
                },

                'size': {
                    'canvasHeight': 130,
                    'canvasWidth': 130,
                    'pieInnerRadius': '68%',
                },
                'data': {
                    'sortOrder': 'value-desc',
                    'content': makeChart1,
                },
                'labels': {
                    'outer': {
                        'format': 'none',
                        'pieDistance': 26
                    },
                    'inner': {
                        'format': 'none',
                        'hideWhenLessThanPercentage': 3
                    },
                    'mainLabel': {
                        'fontSize': 11
                    },
                    'percentage': {
                        'color': '#ffffff',
                        'decimalPlaces': 0
                    },
                    'value': {
                        'color': '#adadad',
                        'fontSize': 11
                    },
                    'lines': {
                        'enabled': true
                    },
                    'truncation': {
                        'enabled': true
                    }
                },
                'effects': {
                    'load': {
                        'effect': 'none'
                    },
                    'pullOutSegmentOnClick': {
                        'effect': 'none',
                        'speed': 400,
                        'size': 8
                    }
                },
                'misc': {
                    'gradient': {
                        'enabled': true,
                        'percentage': 100
                    },
                }
            });
        }
    }

    loadPieChartByTurbine(data) {
        let total = {};
        data.forEach(el => {
            total[el.ProjectCode] = 0
            el.SeveritiesByBlade.forEach(element => {
                total[el.ProjectCode] = total[el.ProjectCode] + element.S1 + element.S2 + element.S3 + element.S4 + element.S5;
            });
        });

        let makeChart1;
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            makeChart1 = [];
            for (const key in element.TotalSeverities[0]) {
                makeChart1.push({
                    label: key,
                    value: element.TotalSeverities[0][key],
                    color: this.getcolor(key)
                });
            }
            this.pie = new window.d3pie(`pie-${element.ProjectCode + element.TurbineId}`, {
                'header': {
                    'title': {
                        'text': total[data[index].ProjectCode],
                        'fontSize': 16,
                        'font': 'open sans'
                    },
                    'location': 'pie-center',
                },
                'size': {
                    'canvasHeight': 110,
                    'canvasWidth': 110,
                    'pieInnerRadius': '68%',
                    "pieOuterRadius": "100%"

                },
                'data': {
                    'sortOrder': 'value-desc',
                    'content': makeChart1,
                },
                'labels': {
                    'outer': {
                        'format': 'none',
                        'pieDistance': 26
                    },
                    'inner': {
                        'format': 'none',
                        'hideWhenLessThanPercentage': 3
                    },
                    'mainLabel': {
                        'fontSize': 11
                    },
                    'percentage': {
                        'color': '#ffffff',
                        'decimalPlaces': 0
                    },
                    'value': {
                        'color': '#adadad',
                        'fontSize': 11
                    },
                    'lines': {
                        'enabled': true
                    },
                    'truncation': {
                        'enabled': true
                    }
                },
                'effects': {
                    'load': {
                        'effect': 'none'
                    },
                    'pullOutSegmentOnClick': {
                        'effect': 'none',
                        'speed': 400,
                        'size': 8
                    }
                },
                'misc': {
                    'gradient': {
                        'enabled': true,
                        'percentage': 100
                    },
                    'canvasPadding': {
                        'top': 0,
                        'right': 0,
                        'bottom': 0,
                        'left': 0
                    }
                }
            });
        }
    }

    getcolor(sev) {
        const legends = this.props.concept;
        if (legends) {
            let color = '';
            legends.filter(result =>
                result.TypeID === 2
            )[0].ConceptsList.forEach(element => {
                if (sev === element.Name) {
                    color = element.ColorCode;
                }
            });
            return color;
        }
    }

    getturbineData(turbine) {

        const obj = [];

        turbine.Projects.forEach(project => {

            const object = {};
            const bladeData = [];
            object.TurbineId = turbine.TurbineId;
            object.LatLOng = `${turbine.Latitude},${turbine.Longitude}`;
            object.SeveritiesByBlade = [];
            object.TotalSeverities = [];
            object.Status = project.TurbineStatusName;
            object.ProjectCode = project.ProjectCode;

            const aData = this.getBladeData(project.SeverityByBlade, 'A');
            const bData = this.getBladeData(project.SeverityByBlade, 'B');
            const cData = this.getBladeData(project.SeverityByBlade, 'C');
            let blade = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0 };
            let S1 = 0, S2 = 0, S3 = 0, S4 = 0, S5 = 0;
            blade.Blade = 'A';
            aData.forEach(item => {
                switch (item.type) {
                    case 1:
                        blade.S1 = blade.S1 + item.count;
                        S1 = S1 + item.count;
                        break;
                    case 2:
                        blade.S2 = blade.S2 + item.count;
                        S2 = S2 + item.count;
                        break;
                    case 3:
                        blade.S3 = blade.S3 + item.count;
                        S3 = S3 + item.count;
                        break;
                    case 4:
                        blade.S4 = blade.S4 + item.count;
                        S4 = S4 + item.count;
                        break;
                    case 5:
                        blade.S5 = blade.S5 + item.count;
                        S5 = S5 + item.count;
                        break;
                }
            });

            bladeData.push(blade);
            blade = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0 };
            blade.Blade = 'B';
            bData.forEach(item => {
                switch (item.type) {
                    case 1:
                        blade.S1 = blade.S1 + item.count;
                        S1 = S1 + item.count;
                        break;
                    case 2:
                        blade.S2 = blade.S2 + item.count;
                        S2 = S2 + item.count;
                        break;
                    case 3:
                        blade.S3 = blade.S3 + item.count;
                        S3 = S3 + item.count;
                        break;
                    case 4:
                        blade.S4 = blade.S4 + item.count;
                        S4 = S4 + item.count;
                        break;
                    case 5:
                        blade.S5 = blade.S5 + item.count;
                        S5 = S5 + item.count;
                        break;
                }
            });
            bladeData.push(blade);
            blade = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0 };
            blade.Blade = 'C';

            cData.forEach(item => {
                switch (item.type) {
                    case 1:
                        blade.S1 = blade.S1 + item.count;
                        S1 = S1 + item.count;
                        break;
                    case 2:
                        blade.S2 = blade.S2 + item.count;
                        S2 = S2 + item.count;
                        break;
                    case 3:
                        blade.S3 = blade.S3 + item.count;
                        S3 = S3 + item.count;
                        break;
                    case 4:
                        blade.S4 = blade.S4 + item.count;
                        S4 = S4 + item.count;
                        break;
                    case 5:
                        blade.S5 = blade.S5 + item.count;
                        S5 = S5 + item.count;
                        break;
                }
            });
            bladeData.push(blade);
            blade = {};

            // severities by blade
            object.SeveritiesByBlade = bladeData;
            object.TotalSeverities.push({ S5: S5, S4: S4, S3: S3, S2: S2, S1: S1 });
            obj.push(object);
        });
        return obj;

    }

    getBladeData(data, blade) {
        const sevData = [];
        const bladeData = data.filter(blades => {
            return blades.Blade === blade;
        });
        bladeData.forEach(b => {
            if (b.DamageDetails && b.DamageDetails.length > 0) {
                b.DamageDetails.forEach(damage => {
                    if (damage.Sevirity && damage.Sevirity.length > 0) {
                        damage.Sevirity.forEach(sev => {
                            const _index = sevData.findIndex(item => item.Severity === sev.Severity);
                            if (_index > -1) {
                                sevData[_index].count = sevData[_index].count + sev.SeverityCount;
                            } else {
                                sevData.push({ type: sev.SeverityId, count: sev.SeverityCount });
                            }
                        });
                    }
                });

            }
        });
        return sevData;
    }

    getDamageSummaryData() {
        const severityArray = [];
        const categoryArray = [];
        for (const severity in Severities) {
                severityArray.push({
                    'name': severity,
                    'count': 0,
                    'severityId': severity
                });
            
        }

        const turbines = JSON.parse(JSON.stringify(this.turbinesWithDamages));
        turbines.forEach(turbine => {
            turbine.Projects.forEach(project => {
                project.SeverityByBlade.forEach(blade => {
                    blade.DamageDetails.forEach(damage => {
                        damage.Sevirity.forEach(sev => {

                            const sevIndex = severityArray.findIndex(function (i) {
                                return i.name === sev.Severity;
                            });
                            // No need to check if sevIndex is -1 as index will always be found.
                            severityArray[sevIndex].count = severityArray[sevIndex].count + sev.SeverityCount;


                            // Update the data for stacked progress bar
                            const catIndex = categoryArray.findIndex(function (i) {
                                return i.name === damage.Category;
                            });
                            if (catIndex !== -1) {
                                categoryArray[catIndex].count = categoryArray[catIndex].count + sev.SeverityCount;


                                const catSevIndex = categoryArray[catIndex].severity.findIndex(function (i) {
                                    return i.SeverityId === sev.SeverityId;
                                });
                                if (catSevIndex !== -1) {
                                    categoryArray[catIndex].severity[catSevIndex].SeverityCount =
                                        categoryArray[catIndex].severity[catSevIndex].SeverityCount + sev.SeverityCount;
                                } else {
                                    categoryArray[catIndex].severity.push(sev);
                                }

                            } else {
                                categoryArray.push({
                                    'name': damage.Category,
                                    'count': sev.SeverityCount,
                                    'severity': [sev]
                                }
                                );
                            }
                        });
                    });
                });
            });
        });

        const damageSummary = [];
        severityArray.sort((a, b) => b.severityId - a.severityId);
        damageSummary.push(severityArray);
        categoryArray.sort((a, b) => {
            if (b.name > a.name) {
                return -1;
            }
            if (b.name < a.name) {
                return 1;
            }
            return 0;
        });
        categoryArray.forEach(category => {
            category.severity.sort((a, b) => {
                if (b.SeverityId < a.SeverityId) {
                    return -1;
                }
                if (b.SeverityId > a.SeverityId) {
                    return 1;
                }
                return 0;
            });
        });
        damageSummary.push(categoryArray);
        this.props.saveDamageSummary(damageSummary);

    }


    googleChecker() {
        // check for maps in case you're using other google api
        if (!window.google) {
            setTimeout(this.googleChecker, 100);
        } else {
            console.log("we're good to go!!");
            // the google maps api is ready to use, render the map
            this.renderMap();
        }
    }


    getSiteLatLongAsyc(siteMapData) {
        const google = window.google;
        return new Promise(resolve => {
            let latLong;
            const geoCoder = new window.window.google.maps.Geocoder();
            geoCoder.geocode({ 'address': siteMapData.Address }, function (results, status) {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    latLong = results[0].geometry.location;
                    resolve(latLong);
                }
            });
        });
    }

    render() {
        this.googleChecker();
        return (
            <div className="card map-holder">
                <div className="card-block" ref="mapContainer" style={{ height: '700px', width: '100%' }} />
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        allSitesData: state.sites.allSitesData,
        singleSiteData: state.sites.singleSiteData,
        isSingleSite: state.sites.isSingleSite,
        sitesAndProjects: state.sites.sitesAndProjects,
        SettingList: state.filters.settings,
        filteredSettings: state.filters.filteredSettings,
        selectedProjects: state.filters.selectedProjects
    }
}

const mapDisptachToProps = dispatch => {
    return {
        saveDamageSummary : (summary) => dispatch({ type: ActionTypes.DAMAGE_SUMMARY_LEFT, summary: summary })
    }
}


export default connect(mapStateToProps, mapDisptachToProps)(SiteMapView)