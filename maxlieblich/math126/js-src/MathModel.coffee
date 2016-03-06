class MathModel
  calc: null
  needsGui: false
  embedInScene: (mathScene) ->
    model = @
    model.mathScene = mathScene
    model.embedObjects()
    old_calc = mathScene.calc
    mathScene.calc = (t) ->
      if model.calc?
        model.calc()(t)
      old_calc(t)
      null

    if model.needsGui
      model.addGui(mathScene.gui)

    if not mathScene.showingObjects
      mathScene.create()
    null


# x, y, z functions of t
class ParametricPathModel extends MathModel
  limits: [-1, 1]
  speed: 2
  minSpeedLimit: 0.001
  resolution: 100
  mover: null
  calc: null
  objects: null
  needsGui: false
  changeEvent: {type: 'change'}

  constructor: (@x, @y, @z, limits = [-1, 1], speed = 2, resolution = 100) ->
    @limits = limits
    @speed = speed
    @mover = new THREE.Mesh(new THREE.SphereGeometry(0.03), new THREE.MeshNormalMaterial())
    # if the particle should be moving, add the calculation routine
    # otherwise, don't do it
    if @speed > @minSpeedLimit
      @calc = ->
        self = @
        (t) ->
          # v = new THREE.Vector3(self.x(t), self.y(t), self.z(t))
          # console.log v
          T = self.speed * t / 1000
          self.mover.position.set self.x(T), self.y(T), self.z(T)
          # self.mover.geometry.verticesNeedUpdate = true
          null
    @generate()
    
  generate: ->
    geometry = new THREE.Geometry()
    for i in [1..@resolution]
      t = @limits[0] + (@limits[1] - @limits[0]) * i / (1.0 * @resolution)
      geometry.vertices.push(new THREE.Vector3(@x(t), @y(t), @z(t)))
    @path = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xff0000}))
    return

  embedObjects: ->
    # if particle should be moving, add the particle to the scene and animate it
    # otherwise, do nothing
    if @speed > @minSpeedLimit
      @mathScene.scene.add(@mover)
      @mathScene.animated = true # do we really want this, or only animate on mouse down?
    @mathScene.scene.add(@path)
    # @mathScene.animate()


# WIP below. do not use.
class IsoCurve extends MathModel
  xmin: -3.00
  xmax: 3.00
  ymin: -3.00
  ymax: 3.00
  level: 0
  func: null
  resolution: 40
  calc: null
  smoothingLevel: 0
  needsGui: false
  name: ""
  curve: null
  algorithm: null

  constructor: ({@func, @xmin, @xmax,
                @ymin, @ymax,
                @resolution, @smoothingLevel,
                @material,
                @name, @algorithm}) ->
    @xmin ?= -3.00
    @xmax ?= 3.00
    @ymin ?= -3.00
    @ymax ?= 3.00
    @resolution ?= 40
    @smoothingLevel ?= 0
    @material ?= new THREE.LineBasicMaterial({color: 0xff0000})
    @name ?= "Curve"
    @debug = false
    @algorithm ?= "marchingSquares"
    @march_async(false)
    @needsGui = true

  embedObjects: ->
    @march_async(false, @algorithm)
    null
    # @mathScene.scene.add(@surface)

  rerender: ->
    if @mathScene?
      @mathScene.scene.remove(@surface)
      console.log "surface removed"
      geom = @march()
      @surface = new THREE.Mesh(geom, @material)
      console.log "surface constructed"
      @mathScene.scene.add(@surface)
      console.log "surface embedded"
      # console.log @scene
      # console.log @objects
    null

  rerender_async: ->
    @march_async(false, @algorithm)

  addGui: (gui) ->
    # console.log @
    f = gui.addFolder(@name)
    f.add(@, 'xmin').step(0.05)
    f.add(@, 'xmax').step(0.05)
    f.add(@, 'ymin').step(0.05)
    f.add(@, 'ymax').step(0.05)
    f.add(@, 'resolution', 40, 800).step(1)
    # f.add(@, 'algorithm', ['marchingCubes', 'marchingTetrahedra', 'surfaceNets'])
    # f.add(@, 'smoothingLevel', 0, 2).step(1)
    f.add(@, 'rerender_async').name("Render")
    # f.add(@, 'debug')
    f.open()
    null

  # see http://stackoverflow.com/a/10372280 for starting Workers via blobs
  march_async: (b, algorithm="marchingSquares") ->
    that = @
    debug = @debug
    window.URL = window.URL || window.webkitURL
    f = @func.toString()
    mc = marchingSquares.toString()

    response = """#{algorithm} = #{mc}
    self.onmessage = function (e) {
      output = #{algorithm}([#{@resolution}, #{@resolution}], #{f}, [[#{@xmin}, #{@ymin}],[#{@xmax}, #{@ymax}]]);
      postMessage(output);
      }
    """
    blob = null
    try
      blob = new Blob([response], {type: 'application/javascript'})
    catch e  # Backwards-compatibility
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder
      blob = new BlobBuilder()
      blob.append(response)
      blob = blob.getBlob()

    worker = new Worker URL.createObjectURL(blob)

    worker.onmessage = (e) ->
      raw_data = e.data
      # console.log raw_data
      # vs = raw_data.positions
      # fs = raw_data.cells
      flat_positions = raw_data.positions
      flat_normals = raw_data.normals
      geometry = new THREE.BufferGeometry()
      geometry.addAttribute( 'position', new THREE.BufferAttribute( flat_positions, 3 ) )
      geometry.addAttribute( 'normal', new THREE.BufferAttribute( flat_normals, 3 ) )

      new_surface = new THREE.Line(geometry, that.material, THREE.LinePieces)

      if b
        if that.mathScene?
          that.mathScene.scene.remove(that.surface)
          console.log "surface removed"
          that.surface = new_surface
          console.log "surface constructed"
          that.mathScene.scene.add(that.surface)
          console.log "surface embedded"
      else
        if that.mathScene?
          that.mathScene.scene.remove(that.surface)
          that.surface = new_surface
          that.mathScene.scene.add(that.surface)
          that.mathScene.render()
      null

    worker.postMessage("Go!")
    null

  modify: (geometry) ->
    smooth = geometry.clone()
    smooth.mergeVertices()
    modifier = new THREE.SubdivisionModifier @smoothingLevel
    modifier.modify(smooth)
    smooth

# Should call this isosurface model!
# But "upcoming" ray marcher might have a slightly different structure. Hm.
# Current issue: the normals don't seem quite right
class MarchingCubesModel extends MathModel
  xmin: -3.00
  xmax: 3.00
  ymin: -3.00
  ymax: 3.00
  zmin: -3.00
  zmax: 3.00
  level: 0
  func: null
  resolution: 40
  calc: null
  smoothingLevel: 0
  needsGui: false
  name: ""
  surface: null
  algorithm: null

  # see march_async below for an explanation of the extras attribute
  constructor: ({@func, @xmin, @xmax,
                @ymin, @ymax, @zmin, @zmax,
                @resolution, @smoothingLevel,
                @material,
                @name, @algorithm}) ->
    @xmin ?= -3.00
    @xmax ?= 3.00
    @ymin ?= -3.00
    @ymax ?= 3.00
    @zmin ?= -3.00
    @zmax ?= 3.00
    @resolution ?= 40
    @smoothingLevel ?= 0
    @material ?= new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
    @name ?= "Surface"
    @debug = false
    @algorithm ?= "surfaceNets"
    @extras ?= ""

    # geom = @march()
    # @surface = new THREE.Mesh(geom, @material)
    @march_async(false)
    @needsGui = true

  embedObjects: =>
    @march_async(false, @algorithm)
    null
    # @mathScene.scene.add(@surface)

  # need to override embedInScene to handle asynchronous rendering so as not to 
  # make the snapshot vanish early
  # binding @ is necessary because it appears that without this, the window is the caller!

  embedCallback: =>
    model = @
    old_calc = model.mathScene.calc
    model.mathScene.calc = (t) ->
      if model.calc?
        model.calc()(t)
      old_calc(t)
      null

    if not @mathScene.showingObjects
      model.mathScene.create()
    null


  embedInScene: (mathScene) ->
    model = @
    model.mathScene = mathScene
    if model.needsGui
      model.addGui(model.mathScene.gui)
    model.embedObjects()
    null


  rerender: ->
    if @mathScene?
      @mathScene.scene.remove(@surface)
      console.log "surface removed"
      geom = @march()
      @surface = new THREE.Mesh(geom, @material)
      console.log "surface constructed"
      @mathScene.scene.add(@surface)
      console.log "surface embedded"
      # console.log @scene
      # console.log @objects
    null

  rerender_async: ->
    @march_async(false, @algorithm)

  addGui: (gui) ->
    # console.log @
    f = gui.addFolder(@name)
    f.add(@, 'xmin').step(0.05)
    f.add(@, 'xmax').step(0.05)
    f.add(@, 'ymin').step(0.05)
    f.add(@, 'ymax').step(0.05)
    f.add(@, 'zmin').step(0.05)
    f.add(@, 'zmax').step(0.05)
    f.add(@, 'resolution', 40, 800).step(1)
    f.add(@, 'algorithm', ['marchingCubes', 'surfaceNets'])
    # f.add(@, 'smoothingLevel', 0, 2).step(1)
    f.add(@, 'rerender_async').name("Render")
    # f.add(@, 'debug')
    f.open()
    null

  # see http://stackoverflow.com/a/10372280 for starting Workers via blobs
  # @extras is an additional string of code that will get inserted in the self.onmessage
  # for example, defining variables for a complicated function
  march_async: (b, algorithm="marchingCubes") ->
    that = @
    debug = @debug
    window.URL = window.URL || window.webkitURL
    f = @func.toString()
    mc = null
    if @algorithm is 'marchingCubes'
      mc = marchingCubes.toString()
    else if @algorithm is 'marchingTetrahedra'
      mc = marchingTetrahedra.toString()
    else if @algorithm is 'surfaceNets'
      mc = surfaceNets.toString()

    response = """#{algorithm} = #{mc}
    self.onmessage = function (e) {
      output = #{algorithm}([#{@resolution}, #{@resolution}, #{@resolution}], #{f}, [[#{@xmin}, #{@ymin}, #{@zmin}],[#{@xmax}, #{@ymax}, #{@zmax}]]);
      postMessage(output);
      }
    """
    blob = null
    try
      blob = new Blob([response], {type: 'application/javascript'})
    catch e  # Backwards-compatibility
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder
      blob = new BlobBuilder()
      blob.append(response)
      blob = blob.getBlob()

    worker = new Worker URL.createObjectURL(blob)

    worker.onmessage = (e) ->
      raw_data = e.data
      # console.log raw_data
      # vs = raw_data.positions
      # fs = raw_data.cells
      flat_positions = raw_data.positions
      flat_normals = raw_data.normals
      geometry = new THREE.BufferGeometry()
      geometry.addAttribute( 'position', new THREE.BufferAttribute( flat_positions, 3 ) );
      geometry.addAttribute( 'normal', new THREE.BufferAttribute( flat_normals, 3 ) );

      smooth = geometry #that.modify geometry FORGET THE CATMULL-CLARK SMOOTHING. it's too annoying with buffergeometry
      new_surface = new THREE.Mesh(smooth, that.material)

      if b
        if that.mathScene?
          that.mathScene.scene.remove(that.surface)
          console.log "surface removed"
          that.surface = new_surface
          console.log "surface constructed"
          that.mathScene.scene.add(that.surface)
          console.log "surface embedded"
          that.embedCallback()
      else
        if that.mathScene?
          that.mathScene.scene.remove(that.surface)
          that.surface = new_surface
          that.mathScene.scene.add(that.surface)
          that.mathScene.render()
          that.embedCallback()
      null

    worker.postMessage("Go!")
    null

  modify: (geometry) ->
    smooth = geometry.clone()
    smooth.mergeVertices()
    modifier = new THREE.SubdivisionModifier @smoothingLevel
    modifier.modify(smooth)
    smooth


class VectorModel extends MathModel
  origin: null
  vector: null
  arrow: null

  constructor: ({origin, vector, color}) ->
    origin ?= [0, 0, 0]
    @orig = new THREE.Vector3(origin[0], origin[1], origin[2])
    vector ?= [1, 0, 0]
    @vec = new THREE.Vector3(vector[0], vector[1], vector[2])
    color ?= 0xff00ff
    @col = color
    dir = @vec.clone().normalize()
    @arrow = new THREE.ArrowHelper(dir, @orig.clone(), @vec.length(), @col)
    @arrow.cone.material = new THREE.MeshLambertMaterial({ambient: @col, color: 0xcccccc, opacity: 1.0})
    return

  embedObjects: ->
    @mathScene.scene.add(@arrow)
    null

class PlaneShadowModel extends MathModel
  normal: null
  position: null
  xrange: null
  yrange: null

  # TODO: add proper lights for casting shadows as desired

  constructor: ({normal, position, xrange, yrange, color}) ->
    # defaults: xy plane
    position ?= [0, 0, 0]
    # @position = new THREE.Vector3 position[0], position[1], position[2]
    normal ?= [0, 0, 1]
    @normal = new THREE.Vector3 normal[0], normal[1], normal[2]
    xrange ?= [-2, 2]
    yrange ?= [-2, 2]
    @xrange = xrange
    @yrange = yrange
    color ?= 0x555555
    @color = color
    @plane = new THREE.Mesh(
      new THREE.PlaneGeometry(@xrange[1] - @xrange[0], @yrange[1] - @yrange[0]),
      new THREE.MeshPhongMaterial({ambient: @color, color: 0x111111, specular: 0x0c0c0c, shininess: 60, side: THREE.DoubleSide}) # otherwise defaults for now....
    )
    # set position and quaternion to orient plane correctly
    @plane.position.set(position[0], position[1], position[2])
    @plane.quaternion = @plane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), @normal.normalize())
    console.log @plane.position
    console.log @position
    
    # for some reason, this isn't quite working. defer.
    @plane.receiveShadow = true;
    @spotLight = new THREE.DirectionalLight(0xffffff, 1)
    s = 10
    @spotLight.position.set(s * normal[0], s * normal[1], s * normal[2])
    @spotLight.castShadow = true
    # @spotLight.shadowCameraVisible = true
    @spotLight.shadowDarkness = 1.0
    @spotLight.shadowCameraFar = 20
    @spotLight.shadowCameraNear = 1
    @spotLight.shadowCameraLeft = -10
    @spotLight.shadowCameraRight = 10
    @spotLight.shadowCameraBottom = -10
    @spotLight.shadowCameraTop = 10
    return

  embedObjects: ->
    @mathScene.enableShadow()
    @mathScene.scene.add @plane
    @mathScene.scene.add @spotLight
    return


window.MathModel = MathModel
window.ParametricPathModel = ParametricPathModel
window.MarchingCubesModel = MarchingCubesModel
window.VectorModel = VectorModel
window.PlaneShadowModel = PlaneShadowModel
