!function(){"use strict";angular.module("webUi",["ngAnimate","ngCookies","ngTouch","ngSanitize","restangular","ui.router","ngMaterial","ui.ace","btford.socket-io","angular-jqcloud","frapontillo.highcharts","angular.filter"])}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){var e=this,t={process:{name:"My new shiny project"}};t=JSON.stringify(t,null,"  "),e.project={config:t}}angular.module("webUi").controller("AdminProjectNewController",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t,n,a){var i=this;a.one(e.projectId).get().then(function(e){i.project=e}),i.start=function(e){var n=t.confirm().title("Start new run").content("Do you really want to start a new run for the project "+i.project.name+"?").ariaLabel("Start new run").targetEvent(e).ok("Yes, start it").cancel("Don't start it");return t.show(n).then(function(){return o()}).then(function(){r("Run started.")})};var o=function(){return i.project.customPOST({},"runs").then(function(){return i.project.customGET()}).then(function(e){i.project=e,a.cache.updateWithProject(e)})},r=function(e){var t=n.simple().content(e).position("bottom right");return n.show(t)}}angular.module("webUi").controller("AdminProjectEditController",e),e.$inject=["$stateParams","$mdDialog","$mdToast","Project"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t){function n(n,a,i){n.$on(e,function(){i.$set("mdMode","")}),n.$on(t,function(){i.$set("mdMode","indeterminate")})}var a={restrict:"A",link:n};return a}angular.module("webUi").directive("toolbarLoader",e),e.$inject=["toolbarLoadedEvent","toolbarLoadingEvent"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";angular.module("webUi").constant("toolbarLoadedEvent","toolbar:loaded").constant("toolbarLoadingEvent","toolbar:loading")}(),function(){"use strict";function e(){function e(e,t){var n=this;n.toggleMainSidenav=function(){return e("main-sidenav").toggle()},n.getActiveClass=function(e){return t.current.name.indexOf(e)>=0?"md-accent md-hue-1":void 0}}var t={restrict:"E",templateUrl:"app/components/toolbar/toolbar.html",scope:{title:"="},controller:e,controllerAs:"vm",bindToController:!0};return e.$inject=["$mdSidenav","$state"],t}angular.module("webUi").directive("toolbar",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){this.listeners=[],this.add=function(e){this.listeners.forEach(function(t){t(e)})},this.addWriteListener=function(e){this.listeners.push(e)},this.removeWriteListener=function(e){this.listeners.splice(this.listeners.indexOf(e,1))}}angular.module("webUi").service("TerminalTrain",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e){function t(t,n,a,i){t.items=[];var o=1e5,r=n[0],s=function(n){Array.prototype.push.apply(t.items,n),t.items.length>o&&t.items.splice(0,t.items.length-o),e(function(){var e=r.offsetHeight+r.scrollTop;e<r.scrollHeight&&(r.scrollTop=r.scrollHeight)})};i.$formatters.push(function(e){e.addWriteListener(s),t.$on("$destroy",function(){e.removeWriteListener(s)})})}var n={restrict:"EAC",require:"ngModel",templateUrl:"app/components/terminal/terminal.html",link:t};return n}angular.module("webUi").directive("terminal",e),e.$inject=["$timeout"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e){return e.service("terms")}angular.module("webUi").factory("Term",e),e.$inject=["Restangular"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){return{restrict:"E",templateUrl:"app/components/synonyms/synonyms.html",controller:t,controllerAs:"synonymsVm",bindToController:!0,replace:!0,scope:{synonymGroups:"="}}}function t(){this.hasElements=function(e){return angular.isArray(e.details)}}angular.module("webUi").directive("synonyms",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e){var t=e.all("stats");return{Terms:e.service("terms",t),Sentiment:e.service("sentiment",t),SentimentTimeline:e.service("sentiment/timeline",t),MessageTimeline:e.service("message/timeline",t),Graph:e.service("profile/graph",t)}}angular.module("webUi").factory("Stat",e),e.$inject=["Restangular"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t){function n(n,a){var i=new t({container:a[0],settings:{defaultNodeColor:"#1A237E",defaultEdgeColor:"#5C6BC0",edgeColor:"default",labelThreshold:8}});n.$watch("graph",function(){i.graph.clear(),n.graph&&(n.graph&&n.graph.hasOwnProperty("nodes")&&n.graph.hasOwnProperty("edges")&&i.graph.read(n.graph),i.killForceAtlas2(),i.refresh(),n.graph.nodes.length>0&&(i.startForceAtlas2({worker:!0,barnesHutOptimize:!0}),e(function(){i.stopForceAtlas2()},3e3)))}),n.$on("$destroy",function(){i.killForceAtlas2(),i.graph.clear()})}var a={restrict:"E",scope:{graph:"="},link:n};return a}angular.module("webUi").directive("sigma",e),e.$inject=["$timeout","Sigma"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){function e(e,t,n,a,i,o,r,s,c,l,m,d,u){var p=this;p.filterDb=s,p.filterTerm=c,p.filterQuery=l,p.filterDateRange=m,p.filterProfile=d,p.filterIndex=u,p.viz=[{group:"Words",id:"word-cloud",name:"Word Cloud",filters:[s,c,l,m]},{group:"Words",id:"word-pie",name:"Pie Chart",filters:[s,c,l,m]},{group:"Words",id:"word-bar",name:"Bar Chart",filters:[s,c,l,m]},{group:"Sentiment",id:"sentiment-pie",name:"Pie Chart",filters:[s,c,l,m]},{group:"Sentiment",id:"sentiment-bar",name:"Bar Chart",filters:[s,c,l,m]},{group:"Sentiment",id:"sentiment-timeline",name:"Timeline",filters:[s,c,l,m]},{group:"Others",id:"message-timeline",name:"Message Timeline",filters:[s,c,l,m]},{group:"Others",id:"profile-graph",name:"Profile Graph",filters:[s,d]},{group:"Others",id:"index-search",name:"Index Search",filters:[u]}],p.hasParam=function(e){var t=p.viz.filter(function(e){return e.id===p.params.dataViz});return t&&1===t.length?t[0].filters.indexOf(e)>=0:!1},p.availableFilters=[{name:"all",type:""},{name:"tags",type:"tag"},{name:"categories",type:"category"},{name:"tokens",type:"token"}],p.availableIndexTypes=[{name:"lemmas",type:"lemmas"},{name:"stems",type:"stems"},{name:"tokens",type:"tokens"},{name:"POS tag tokens",type:"postagtoken"}],p.availableEngines=[{name:"Spark",type:"spark"},{name:"Semantic Vectors",type:"semanticvectors"}];var f=function(e){var t=[];return angular.isArray(e)?t=e:angular.isDefined(e)&&(t=[e]),t};p.params.dataViz=n.chartType,p.params.database=n.db,n.from&&(p.params.fromDate=new Date(n.from)),n.to&&(p.params.toDate=new Date(n.to)),p.params.filterOn=n.filter||"",p.params.query=f(n.search),p.params.users=f(n.users),p.params.corpus=n.corpus,p.params.indexType=n.indexType,p.params.index=f(n.index),p.params.engine=n.engine,t.$watchGroup(["sidenavViewVm.params.filterOn","sidenavViewVm.params.database"],function(e,t){(angular.isDefined(t[0])&&t[0]!==e[0]||angular.isDefined(t[1])&&t[1]!==e[1])&&(p.params.query=[])}),t.$watch("sidenavViewVm.params",function(t){var n={chartType:t.dataViz,db:t.database,filter:t.filterOn,search:t.query,users:t.users,corpus:t.corpus,index:t.index,indexType:t.indexType,engine:t.engine};return n.from=t.fromDate?t.fromDate.toISOString():null,n.to=t.toDate?t.toDate.toISOString():null,e.go("app.view",n)},!0),a.getList().then(function(e){p.databases=e,angular.isDefined(n.db)&&(p.params.database=n.db)}),r.getList().then(function(e){p.corpora=e,angular.isDefined(n.corpus)&&(p.params.corpus=n.corpus)}),p.queryForElement=function(e,t){return i.getList({db:p.params.database,type:t,term:e})},p.queryForUser=function(e){return o.getList({db:p.params.database,username:e})}}var t={restrict:"E",templateUrl:"app/components/sidenav-view/sidenav-view.html",scope:{params:"="},controller:e,controllerAs:"sidenavViewVm",bindToController:!0};return e.$inject=["$state","$scope","$stateParams","Database","Term","Profile","Corpus","filterDb","filterTerm","filterQuery","filterDateRange","filterProfile","filterIndex"],t}angular.module("webUi").directive("sidenavView",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){function e(e,t,n,a){var i=this,o=function(){i.projects=a.cache.projects};a.cache.addOnCacheChangeListener(o),a.cache.getOrLoad(),o(),i.openProject=function(e){t.go("app.admin.project.edit",{projectId:e}),n("main-sidenav").close()},i.goToNew=function(){t.go("app.admin.project.new"),n("main-sidenav").close()},e.$on("$destroy",function(){a.cache.removeOnCacheChangeListener(o)})}var t={restrict:"E",templateUrl:"app/components/sidenav-admin/sidenav-admin.html",scope:{dataViz:"=",params:"="},controller:e,controllerAs:"sidenavAdminVm",bindToController:!0};return e.$inject=["$scope","$state","$mdSidenav","Project"],t}angular.module("webUi").directive("sidenavAdmin",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){function e(e){var t=this;t.evalMdMedia=function(t){return e(t)}}var t={restrict:"E",templateUrl:"app/components/sidenav/sidenav.html",transclude:!0,controller:e,controllerAs:"sidenavVm",bindToController:!0,replace:!0};return e.$inject=["$mdMedia"],t}angular.module("webUi").directive("sidenav",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){function e(e,t,n,a,i,o,r){var s=this,c=function(e){var n=t.simple().content(e).position("bottom right");return t.show(n)};e.$watchCollection("projectRunsVm.config.runs",function(e){var t=e||[];s.stopped=t.filter(function(e){return angular.isDefined(e.dateEnd)}),s.running=t.filter(function(e){return angular.isUndefined(e.dateEnd)})},!0),s.showRunning=function(){return s.running.length>0},s.showStopped=function(){return s.stopped.length>0},s.showDivider=function(){return s.showRunning()&&s.showStopped()},s.stop=function(e,t){t.stopPropagation();var i=a("date")(e.dateStart,"short"),o=n.confirm().title("Stop run").content("Do you really want to stop the run started at"+i+"?").ariaLabel("Stop run").targetEvent(t).ok("Yes, stop it").cancel("Don't stop it");return n.show(o).then(function(){return l(e)}).then(function(){c("Run stopped.")})};var l=function(e){return s.config.one("runs",e._id).remove().then(function(){return s.config.customGET()}).then(function(e){s.config=e,o.cache.updateWithProject(e)})};s.showLog=function(e,t){return n.show({controller:"LogDialogCtrl",templateUrl:"app/components/log-dialog/log-dialog.html",parent:angular.element(i.body),targetEvent:t,clickOutsideToClose:!0,locals:{run:e}})["finally"](function(){r.emit("closeLog",e._id)})}}var t={restrict:"E",templateUrl:"app/components/project-runs/project-runs.html",controller:e,controllerAs:"projectRunsVm",bindToController:!0,replace:!0,scope:{config:"="}};return e.$inject=["$scope","$mdToast","$mdDialog","$filter","$document","Project","logsSocket"],t}angular.module("webUi").directive("projectRuns",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){function e(e,t,n,a,i){var o=this;o.editorLoaded=function(e){e.$blockScrolling=1/0,e.getSession().setTabSize(2)},o.isNew=function(){return!(o.config&&o.config.hasOwnProperty("_id"))};var r=function(e){var n=t.simple().content(e).position("bottom right");return t.show(n)};o.save=function(){o.isSaving=!0;try{var t=JSON.parse(o.config.config);o.config.config=JSON.stringify(t,null,"  ")}catch(n){return r("Error in the JSON configuration.")}return s().then(function(e){return o.config=e,i.cache.updateWithProject(e),r("Project saved."),a.go("^.edit",{projectId:o.config._id}),!0})["catch"](function(){return e.error("Couldn't save project."),r("Error while saving project."),!1})["finally"](function(){o.isSaving=!1})};var s=function(){return o.isNew()?i.post(o.config):o.config.save()};o["delete"]=function(e){o.isSaving=!0;var t=n.confirm().title("Delete project "+o.config.name).content("Do you really want to delete this project?").ariaLabel("Delete project").targetEvent(e).ok("Yes, delete it").cancel("Don't delete it");return n.show(t).then(function(){return c()}).then(function(){return i.cache.removeProject(o.config),r("Project removed."),a.go("^.main"),!0})["catch"](function(e){r(e.data.message)})["finally"](function(){o.isSaving=!1})};var c=function(){return o.config.remove()}}var t={restrict:"E",templateUrl:"app/components/project-config/project-config.html",controller:e,controllerAs:"projectConfigVm",bindToController:!0,replace:!0,scope:{config:"="}};return e.$inject=["$log","$mdToast","$mdDialog","$state","Project"],t}angular.module("webUi").directive("projectConfig",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e){var t="projects",n=e.service(t);n.from=function(n){return e.restangularizeElement(null,n,t)},n.cache={},n.cache.projects=void 0,n.cache.listeners=[],n.cache.addOnCacheChangeListener=function(e){n.cache.listeners.push(e)},n.cache.removeOnCacheChangeListener=function(e){var t=n.cache.listeners.indexOf(e);t>=0&&n.cache.listeners.splice(t,1)};var a=function(e){n.cache.listeners.forEach(function(t){t(e)})};return n.cache.updateWithProject=function(e){var t=!1;n.cache.isLoaded()?n.cache.projects.forEach(function(a,i){t||n.cache.projects[i]._id===e._id&&(n.cache.projects[i]=e,t=!0)}):n.cache.projects=[],t||n.cache.projects.push(e),a(e)},n.cache.removeProject=function(e){n.cache.isLoaded()&&(n.cache.projects.forEach(function(t,a){n.cache.projects[a]._id===e._id&&n.cache.projects.splice(a,1)}),a(e))},n.cache.isLoaded=function(){return"undefined"!=typeof n.cache.projects},n.cache.invalidate=function(){return n.getList().then(function(e){n.cache.projects=e,a(e)})},n.cache.getOrLoad=function(){return n.cache.isLoaded()?n.cache.projects:n.cache.invalidate()},n}angular.module("webUi").factory("Project",e),e.$inject=["Restangular"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e){return e.service("profiles")}angular.module("webUi").factory("Profile",e),e.$inject=["Restangular"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t){function n(n,a,i,o){a.append('<input type="file"/>');var r=a,s=a.find("input");s.css({width:"0.1px",height:"0.1px",opacity:"0",overflow:"hidden",position:"absolute","z-index":"-1"});var c=function(){return s[0].click(),!1},l=function(n){var a=n.target.files[0];if(a){if("application/json"!==a.type)return void e.warn("Unhandled file type "+a.type);var i=new t;i.onload=function(){o.$setViewValue(i.result),o.$modelValue=i.result},i.readAsText(a)}};r.bind("click",c),s.bind("change",l),n.$on("$destroy",function(){r.unbind("click",c)})}var a={restrict:"A",require:"ngModel",priority:1e3,link:n};return a}angular.module("webUi").directive("mdChooseFile",e),e.$inject=["$log","FileReader"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t,n){var a=e.connect(n.socket+"logs");return t({ioSocket:a})}angular.module("webUi").factory("logsSocket",e),e.$inject=["io","socketFactory","config"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t,n,a,i,o){e.terminal=o,e.getFullLogUrl=function(){return n.api+"projects/"+t.projectId+"/runs/"+i._id+"/log"},a.forward(["logs:clear","logs:cat","logs:tail"],e),a.emit("openLog",i._id),e.$on("socket:logs:tail",function(t,n){e.terminal.add(n)})}angular.module("webUi").controller("LogDialogCtrl",e),e.$inject=["$scope","$stateParams","config","logsSocket","run","TerminalTrain"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e){return e.service("languages")}angular.module("webUi").factory("Language",e),e.$inject=["Restangular"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t){return e.withConfig(function(e){e.setBaseUrl(t.index)})}angular.module("webUi").factory("Index",e),e.$inject=["Restangular","config"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e){return e.service("databases")}angular.module("webUi").factory("Database",e),e.$inject=["Restangular"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e){return e.service("indices")}angular.module("webUi").factory("Corpus",e),e.$inject=["Index"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(){var e,t=[];return this.useConfigPath=function(t){e=t},this.addConfigResolvedListener=function(e){t.push(e)},this.$get=["$http","$log",function(n,a){var i=n.get(e);return i=i.then(function(e){angular.extend(i,e.data),t.forEach(function(e){e(i)}),a.debug("Configuration downloaded and stored.")})}],this}angular.module("webUi").provider("config",e)}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t,n,a,i,o,r){var s=this;s.params={};var c=function(e){return{chart:{plotBackgroundColor:null,plotBorderWidth:null,plotShadow:!1,type:e},title:{text:null},exporting:{buttons:{contextButton:{enabled:!1}}},credits:{enabled:!1},legend:{enabled:!1}}},l=function(e,t){var n=c("pie");return n.tooltip={pointFormat:"{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>"},n.plotOptions={pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,format:"<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)",style:{color:Highcharts.theme&&Highcharts.theme.contrastTextColor||"black"}}}},n.series=[{name:e,colorByPoint:!0,data:t}],n},m=function(e,t,n,a){var i=c("bar");return i.tooltip={pointFormat:"{series.name}: <b>{point.y}</b>"},i.xAxis={categories:t,title:{text:e}},i.yAxis={title:{text:n},labels:{overflow:"justify"}},i.series=[{name:n,colorByPoint:!0,data:a}],i},d=function(e,t){var n=c("spline");return n.xAxis={type:"datetime",dateTimeLabelFormats:{month:"%e. %b",year:"%b"},title:{text:"Date"}},n.yAxis={title:{text:e}},n.tooltip={headerFormat:"<b>{series.name}</b><br>",pointFormat:"{point.x:%e. %b}: {point.y:.2f}"},n.plotOptions={spline:{marker:{enabled:!0}}},n.series=t,n},u=function(){return{db:s.params.database,type:s.params.filterOn,terms:s.params.query,from:s.params.fromDate,to:s.params.toDate,users:s.params.users}},p=function(){return o.Terms.getList(u())},f=function(){return o.Sentiment.getList(u())},g=function(){return o.SentimentTimeline.getList(u())},h=function(){return o.MessageTimeline.getList(u())},v=function(){return o.Graph.one().get(u())},b=function(e){return e.map(function(e){return{name:e.name,y:e.value}})},y=function(e){var t=e.map(function(e){return e.name}),n=e.map(function(e){return e.value});return[t,n]},w=function(e){return e.map(function(e){var t="#000000";return"positive"===e.name?t="#73E639":"negative"===e.name&&(t="#E63939"),{name:e.name,data:e.values.map(function(e){return[new Date(e.date).getTime(),e.value]}),color:t}})},V=function(){return p().then(function(e){return e.map(function(e){return{text:e.name,weight:e.value}})}).then(function(e){s.stat=e})},j=function(){return p().then(b).then(function(e){s.stat=l("Occurrences",e)})},x=function(){return p().then(y).then(function(e){s.stat=m(s.params.filterOn,e[0],"Occurrences",e[1])})},$=function(){return f().then(b).then(function(e){s.stat=l("Sentiments",e)})},P=function(){return f().then(y).then(function(e){s.stat=m(s.params.filterOn,e[0],"Sentiments",e[1])})},S=function(){return g().then(w).then(function(e){s.stat=d("Sentiment Distribution",e)})},C=function(){return h().then(w).then(function(e){s.stat=d("Message Distribution",e)})},U=function(){return v().then(function(e){for(var t=e.nodes.length,n=0;n<e.nodes.length;n++)e.nodes[n].label=e.nodes[n].id,e.nodes[n].size=.3,e.nodes[n].x=100*Math.cos(2*n*Math.PI/t),e.nodes[n].y=100*Math.sin(2*n*Math.PI/t),s.params.users.indexOf(e.nodes[n].id)>=0&&(e.nodes[n].size=1,e.nodes[n].color="#E91E63");for(var a=0;a<e.edges.length;a++)e.edges[a].id=e.edges[a].source+"-->"+e.edges[a].target;return e}).then(function(e){s.stat=e})},D=function(){if(angular.isDefined(s.params.engine)&&angular.isDefined(s.params.corpus)&&angular.isDefined(s.params.index)&&angular.isDefined(s.params.indexType)){var e=s.params.index.map(function(e){return i.get(r.index+"ml/word2vec/"+s.params.engine+"/"+s.params.corpus+"/"+e+"/"+s.params.indexType).then(function(t){return t.data.term=e,t.data})});return a.all(e).then(function(e){s.stat=e})}},T={"word-cloud":V,"word-pie":j,"word-bar":x,"sentiment-pie":$,"sentiment-bar":P,"sentiment-timeline":S,"message-timeline":C,"profile-graph":U,"index-search":D};e.$watch("vm.params",function(e,a){if(e!==a&&(s.stat=null,T.hasOwnProperty(e.dataViz))){var i=T[e.dataViz]();i&&i.then(function(){t(function(){n.dispatchEvent(new Event("resize"))})})}},!0)}angular.module("webUi").controller("ViewIndexController",e),e.$inject=["$scope","$timeout","$window","$q","$http","Stat","config"]}(),/*
 * Copyright 2015 Francesco Pontillo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){"use strict";function e(e,t,n,a,i,o,r){var s=this;s.sentiments=[{type:"",value:"Any"},{type:"positive",value:"Positive"},{type:"neuter",value:"Neuter"},{type:"negative",value:"Negative"}],s.params={sentiment:""},a.getList().then(function(e){s.databases=e}),s.searchAuthors=function(e,t){return i.getList({db:t,username:e})},e.$watch("vm.params.database",function(e){o.getList({db:e}).then(function(e){s.languages=[""].concat(e)})}),s.download=function(){if(!s.params.database)return n.show(n.simple().content("Please select a database first").position("bottom right").hideDelay(3e3));var e=r.api+"databases/"+s.params.database+"?";s.params.language&&(e+="language="+s.params.language+"&"),s.params.author&&(e+="author="+s.params.author+"&"),s.params.sentiment&&(e+="sentiment="+s.params.sentiment+"&"),e=e.substr(0,e.length-1),t.open(e)}}angular.module("webUi").controller("ExportController",e),e.$inject=["$scope","$window","$mdToast","Database","Profile","Language","config"]}(),function(){"use strict";function e(e){e.debug("runBlock end")}angular.module("webUi").run(e),e.$inject=["$log"]}(),function(){"use strict";function e(e,t){e.state("app",{url:"","abstract":!0,templateUrl:"app/__abstract.html",resolve:{config:"config"}}).state("app.view",{url:"/view?chartType&db&from&to&filter&search&users&corpus&index&indexType&engine",reloadOnSearch:!1,templateUrl:"app/view/index.html",controller:"ViewIndexController",controllerAs:"vm"}).state("app.admin",{url:"/admin","abstract":!0,templateUrl:"app/admin/index.html"}).state("app.export",{url:"/export",templateUrl:"app/export/export.html",controller:"ExportController",controllerAs:"vm"}).state("app.admin.main",{url:"",templateUrl:"app/admin/main/main.html"}).state("app.admin.project",{url:"/project","abstract":!0,templateUrl:"app/__abstract.html"}).state("app.admin.project.main",{url:"",templateUrl:"app/admin/project/main/project-main.html"}).state("app.admin.project.new",{url:"/new",templateUrl:"app/admin/project/new/project-new.html",controller:"AdminProjectNewController",controllerAs:"vm"}).state("app.admin.project.edit",{url:"/:projectId",templateUrl:"app/admin/project/edit/project-edit.html",controller:"AdminProjectEditController",controllerAs:"vm"}),t.otherwise("/view")}angular.module("webUi").config(e),e.$inject=["$stateProvider","$urlRouterProvider"]}(),function(){"use strict";angular.module("webUi").constant("io",io).constant("moment",moment).constant("FileReader",FileReader).constant("Sigma",sigma),angular.module("webUi").constant("filterDb","DB").constant("filterTerm","T").constant("filterQuery","Q").constant("filterDateRange","D").constant("filterProfile","P").constant("filterIndex","I")}(),function(){"use strict";function e(e){e.debugEnabled(!0)}function t(e,t){e.useConfigPath("/config.json"),e.addConfigResolvedListener(function(e){t.setBaseUrl(e.api)}),t.setRestangularFields({id:"_id"})}function n(e){var t=function(e,t,n,a,i,o){var r,s=0,c=0,l=function(){c++},m=function(){r&&a.cancel(r),r=a(function(){return c>=s?(c=0,s=0,t.$broadcast(i)):t.$broadcast(o)},300)};return{request:function(e){return 0===s&&t.$broadcast(o),s++,e},response:function(e){return l(),m(),e},responseError:function(t){return l(),m(),e.reject(t)}}};t.$inject=["$q","$rootScope","$log","$timeout","toolbarLoadedEvent","toolbarLoadingEvent"],e.interceptors.push(t)}angular.module("webUi").config(e).config(t).config(n),e.$inject=["$logProvider"],t.$inject=["configProvider","RestangularProvider"],n.$inject=["$httpProvider"]}(),angular.module("webUi").run(["$templateCache",function(e){e.put("app/__abstract.html",'<div ui-view="" flex="" layout="row"></div>'),e.put("app/admin/index.html",'<sidenav-admin id="sidenav-admin" layout="column"></sidenav-admin><div ui-view="" flex="" layout="column"></div>'),e.put("app/export/export.html",'<md-content layout-padding="" flex=""><form name="exportForm" layout="column"><md-input-container><label>Database</label><md-select ng-model="vm.params.database"><md-option ng-repeat="db in vm.databases" value="{{db.name}}">{{db.name}}</md-option></md-select></md-input-container><md-autocomplete md-selected-item="vm.params.author" md-search-text="vm.searchAuthor" md-items="author in vm.searchAuthors(vm.searchAuthor, vm.params.database)" md-item-text="author" md-min-length="3" md-no-cache="true" placeholder="Author (min 3 chars)"><span md-highlight-text="vm.searchAuthor">{{author}}</span></md-autocomplete><md-input-container><label>Language</label><md-select ng-model="vm.params.language"><md-option ng-repeat="language in vm.languages" value="{{language}}">{{language}}</md-option></md-select></md-input-container><md-input-container><label>Sentiment</label><md-select ng-model="vm.params.sentiment"><md-option ng-repeat="sentiment in vm.sentiments" value="{{sentiment.type}}">{{sentiment.value}}</md-option></md-select></md-input-container><div layout="row"><md-button flex="" class="md-primary md-raised" ng-click="vm.download()"><md-icon>file_download</md-icon>Export</md-button></div></form></md-content>'),e.put("app/view/index.html",'<sidenav-view id="sidenav-view" layout="column" params="vm.params"></sidenav-view><md-content layout-padding="" ng-if="!vm.params.dataViz"><p>This is the main view page.</p><p>Please select a data visualization type from the left sidebar.</p></md-content><md-content flex="" layout="column"><jqcloud ng-if="vm.params.dataViz === \'word-cloud\'" words="vm.stat" flex="" auto-resize="true"></jqcloud><chart ng-if="vm.params.dataViz === \'word-pie\'" flex="" options="vm.stat"></chart><chart ng-if="vm.params.dataViz === \'word-bar\'" flex="" options="vm.stat"></chart><chart ng-if="vm.params.dataViz === \'sentiment-pie\'" flex="" options="vm.stat"></chart><chart ng-if="vm.params.dataViz === \'sentiment-bar\'" flex="" options="vm.stat"></chart><chart ng-if="vm.params.dataViz === \'sentiment-timeline\'" flex="" options="vm.stat"></chart><chart ng-if="vm.params.dataViz === \'message-timeline\'" flex="" options="vm.stat"></chart><sigma ng-if="vm.params.dataViz === \'profile-graph\'" flex="" graph="vm.stat"></sigma><synonyms ng-if="vm.params.dataViz === \'index-search\'" synonym-groups="vm.stat"></synonyms></md-content>'),e.put("app/admin/main/main.html",'<md-content layout-padding=""><p>This is the main admin page.</p><p>Please select a project from the left sidebar.</p></md-content>'),e.put("app/components/log-dialog/log-dialog.html",'<div layout="column" flex=""><terminal ng-model="terminal" flex="" layout="column"></terminal><div layout="row"><md-button flex="" class="md-primary" ng-href="{{getFullLogUrl()}}" target="_blank">Full log</md-button></div></div>'),e.put("app/components/project-config/project-config.html",'<div layout="column" flex=""><md-menu-bar layout="row"><md-button ng-disabled="projectConfigVm.isSaving" ng-click="projectConfigVm.save()" aria-label="Save configuration"><md-icon>save</md-icon>Save</md-button><md-button ng-disabled="projectConfigVm.isSaving" md-choose-file="" ng-model="projectConfigVm.config.config" aria-label="Upload file"><md-icon>file_upload</md-icon>Upload...</md-button><span flex=""></span><md-button ng-disabled="projectConfigVm.isSaving" ng-click="projectConfigVm.delete($event)" class="md-accent" aria-label="Delete project" ng-show="!projectConfigVm.isNew()"><md-icon>delete</md-icon>Delete</md-button></md-menu-bar><div flex="" ui-ace="{ useWrapMode: true, showGutter: true, theme: \'solarized_dark\', mode: \'json\', onLoad: projectConfigVm.editorLoaded }" ng-readonly="projectConfigVm.isSaving" ng-model="projectConfigVm.config.config"></div></div>'),e.put("app/components/project-runs/project-runs.html",'<md-list flex=""><p layout-padding="" ng-show="(!projectRunsVm.showStopped() && !projectRunsVm.showRunning())">This project has never been run. Press the play button to start it!</p><md-subheader ng-show="projectRunsVm.showRunning()">Now running...</md-subheader><md-list-item ng-repeat="run in projectRunsVm.running | orderBy:\'dateStart\':-1" ng-click="projectRunsVm.showLog(run, $event)"><md-icon>receipt</md-icon><p>Started on {{ run.dateStart | date:\'short\' }}</p><md-icon ng-click="projectRunsVm.stop(run, $event)" aria-label="Stop run" class="md-accent">stop</md-icon></md-list-item><md-divider ng-show="projectRunsVm.showDivider()"></md-divider><md-subheader ng-show="projectRunsVm.showStopped()">Past executions</md-subheader><md-list-item class="md-2-line" ng-repeat="run in projectRunsVm.stopped | orderBy:\'date_end\':-1" ng-click="projectRunsVm.showLog(run, $event)"><md-icon>receipt</md-icon><div class="md-list-item-text" layout="column"><h3>Finished on {{ run.dateStart | date:\'short\' }}</h3><h4>Started on {{ run.dateEnd | date: \'short\' }}</h4></div></md-list-item></md-list>'),e.put("app/components/sidenav/sidenav.html",'<md-sidenav md-component-id="main-sidenav" md-is-locked-open="$mdMedia(\'gt-md\')" layout="column" flex="" class="md-sidenav-left" ng-class="{ \'md-whiteframe-z2\': sidenavVm.evalMdMedia(\'gt-md\'), \'md-whiteframe-z5\': sidenavVm.evalMdMedia(\'md\') }"><md-content><ng-transclude></ng-transclude></md-content></md-sidenav>'),e.put("app/components/sidenav-admin/sidenav-admin.html",'<sidenav><md-list><md-subheader class="with-flex-md-subheader-content" layout="row"><p flex="">Projects</p><md-button ng-click="sidenavAdminVm.goToNew()" class="md-icon-button" aria-label="New project"><md-icon>add</md-icon><md-tooltip>Create a new project</md-tooltip></md-button></md-subheader><md-list-item class="md-3-line" ng-repeat="project in sidenavAdminVm.projects" ng-click="sidenavAdminVm.openProject(project._id)"><div class="md-list-item-text"><h3>{{project.name}}</h3></div><md-divider ng-if="!$last"></md-divider></md-list-item></md-list></sidenav>'),e.put("app/components/sidenav-view/sidenav-view.html",'<sidenav><md-content><md-toolbar class="md-theme-light"><h1 class="md-toolbar-tools">Filters</h1></md-toolbar><md-content layout-padding=""><form name="sidenav-filter-form" layout="column"><md-input-container><label>Data visualization</label><md-select ng-model="sidenavViewVm.params.dataViz" placeholder="Data visualization"><md-optgroup ng-repeat="(key, elem) in sidenavViewVm.viz | groupBy:\'group\'" label="{{key}}"><md-option ng-repeat="viz in elem" ng-value="viz.id">{{viz.name}}</md-option></md-optgroup></md-select></md-input-container><md-input-container ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterDb)"><label>Database</label><md-select ng-model="sidenavViewVm.params.database"><md-option ng-repeat="db in sidenavViewVm.databases" value="{{db.name}}">{{db.name}}</md-option></md-select></md-input-container><div ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterDateRange)" class="md-custom-container with-padding" layout="row"><md-datepicker ng-model="sidenavViewVm.params.fromDate" md-placeholder="From date" flex=""></md-datepicker><md-button class="md-icon-button clear" ng-click="sidenavViewVm.params.fromDate = undefined"><md-icon>clear</md-icon></md-button></div><div ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterDateRange)" class="md-custom-container with-padding" layout="row"><md-datepicker ng-model="sidenavViewVm.params.toDate" md-placeholder="To date" flex=""></md-datepicker><md-button class="md-icon-button clear" ng-click="sidenavViewVm.params.toDate = undefined"><md-icon>clear</md-icon></md-button></div><md-input-container ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterTerm)"><label>Filter on</label><md-select flex="" ng-model="sidenavViewVm.params.filterOn"><md-option ng-repeat="filter in sidenavViewVm.availableFilters" value="{{filter.type}}">{{filter.name}}</md-option></md-select></md-input-container><md-chips ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterQuery) && sidenavViewVm.params.filterOn !== \'\'" ng-model="sidenavViewVm.params.query" md-autocomplete-snap="" md-require-match="true"><md-autocomplete md-selected-item="sidenavViewVm.selectedItem" md-search-text="sidenavViewVm.searchQueryElement" md-items="item in sidenavViewVm.queryForElement(sidenavViewVm.searchQueryElement, sidenavViewVm.params.filterOn)" md-item-text="item.name" md-min-length="0" placeholder="{{\'Search for \' + sidenavViewVm.params.filterOn}}"><span md-highlight-text="sidenavViewVm.searchQueryElement">{{item}}</span></md-autocomplete><md-chip-template><span>{{$chip}}</span></md-chip-template></md-chips><md-chips ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterProfile)" ng-model="sidenavViewVm.params.users" md-autocomplete-snap="" md-require-match="true"><md-autocomplete md-selected-item="sidenavViewVm.selectedUser" md-search-text="sidenavViewVm.searchQueryUser" md-items="item in sidenavViewVm.queryForUser(sidenavViewVm.searchQueryUser)" md-item-text="item.name" md-min-length="0" placeholder="Search for users"><span md-highlight-text="sidenavViewVm.searchQueryUser">{{item}}</span></md-autocomplete><md-chip-template><span>{{$chip}}</span></md-chip-template></md-chips><md-input-container ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterIndex)"><label>Available corpora</label><md-select flex="" ng-model="sidenavViewVm.params.corpus"><md-option ng-repeat="corpus in sidenavViewVm.corpora" value="{{corpus}}">{{corpus}}</md-option></md-select></md-input-container><md-input-container ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterIndex)"><label>Index type</label><md-select flex="" ng-model="sidenavViewVm.params.indexType"><md-option ng-repeat="filter in sidenavViewVm.availableIndexTypes" value="{{filter.type}}">{{filter.name}}</md-option></md-select></md-input-container><md-input-container ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterIndex)"><label>Engine</label><md-select flex="" ng-model="sidenavViewVm.params.engine"><md-option ng-repeat="filter in sidenavViewVm.availableEngines" value="{{filter.type}}">{{filter.name}}</md-option></md-select></md-input-container><md-chips ng-if="sidenavViewVm.hasParam(sidenavViewVm.filterIndex)" ng-model="sidenavViewVm.params.index" placeholder="Enter an index term" secondary-placeholder="Enter an index term"></md-chips></form></md-content></md-content></sidenav>'),e.put("app/components/synonyms/synonyms.html",'<md-content><div ng-repeat="synonymGroup in synonymsVm.synonymGroups" layout="column" layout-padding="" layout-wrap="" layout-fill=""><h2 class="md-title">{{synonymGroup.term}}</h2><p class="synonym-error" ng-if="synonymGroup.error">{{synonymGroup.error}}</p><p class="synonym-error" ng-if="synonymGroup.details.length === 0">No synonyms found.</p><p class="synonym-error" ng-if="synonymGroup.status === \'error\'">{{synonymGroup.details}}</p><div ng-if="synonymsVm.hasElements(synonymGroup)" layout="row" layout-padding="" layout-wrap="" layout-fill="" layout-align="center center"><div ng-repeat="synonym in synonymGroup.details" class="synonym-item" flex-sm="50" flex-gt-sm="25" flex-gt-md="20"><md-whiteframe class="md-2-line md-whiteframe-1dp" layout="column" layout-padding=""><h4>{{synonym.term}}</h4><p>Score: {{synonym.score}}</p></md-whiteframe></div></div><md-divider ng-if="!$last"></md-divider></div></md-content>'),e.put("app/components/terminal/terminal.html",'<div flex=""><p ng-repeat="i in items track by $index">{{i}}</p><div class="cursor"></div></div>'),e.put("app/components/toolbar/toolbar.html",'<md-toolbar layout="column" layout-align="center center"><md-progress-linear toolbar-loader="" class="md-accent" md-mode=""></md-progress-linear><div flex="" class="md-toolbar-tools"><md-button ng-click="vm.toggleMainSidenav()" hide-gt-md="" class="md-icon-button" aria-label="Settings"><md-icon>menu</md-icon></md-button><h3><span>Crowd Pulse</span></h3><h2><span>{{title}}</span></h2><span flex=""></span><md-button ui-sref="app.view" ng-class="vm.getActiveClass(\'app.view\')"><md-tooltip>Data visualizations</md-tooltip><md-icon>insert_chart</md-icon>View</md-button><md-button ui-sref="app.admin.main" ng-class="vm.getActiveClass(\'app.admin\')"><md-tooltip>Add and edit projects</md-tooltip><md-icon>settings_applications</md-icon>Admin</md-button><md-button ui-sref="app.export" ng-class="vm.getActiveClass(\'app.export\')"><md-tooltip>Export messages from a database</md-tooltip><md-icon>file_download</md-icon>Export</md-button></div></md-toolbar>'),e.put("app/admin/project/edit/project-edit.html",'<div flex="" layout="column"><md-tabs flex="" layout="column" md-border-bottom="" class="md-full-tabs-template"><md-tab flex="" layout="column"><md-tab-label>Configuration file</md-tab-label><md-tab-body flex="" layout="column"><project-config config="vm.project"></project-config></md-tab-body></md-tab><md-tab><md-tab-label>Runs & Logs</md-tab-label><md-tab-body flex="" class="md-padding"><project-runs config="vm.project"></project-runs></md-tab-body></md-tab></md-tabs><div layout="row"><md-button ng-click="vm.start($event)" class="md-accent md-fab md-fab-bottom-right"><md-icon>play_arrow</md-icon></md-button></div></div>'),e.put("app/admin/project/main/project-main.html",'<md-content layout-padding=""><p>Please select a project from the list in the left side navigator.</p></md-content>'),e.put("app/admin/project/new/project-new.html",'<md-content flex="" layout="column"><project-config config="vm.project"></project-config></md-content>')}]);