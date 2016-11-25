function init() {
    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;
        Composites = Matter.Composites,
        Common = Matter.Common,
        Query = Matter.Query,
        Svg = Matter.Svg;

    // create an engine
    var engine = Engine.create();

    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 1366,
            height: 768,
            pixelRatio: 1
        }
    });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    var world = engine.world;

    world.bodies = [];

    var terrain;

    $.get('circle1.svg').done(function (data) {
        var vertexSets = [],
            color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);

        $(data).find('path').each(function (i, path) {
            vertexSets.push(Svg.pathToVertices(path, 30));
        });

        terrain = Bodies.fromVertices(670/2 + 100, 650/2, vertexSets, {
            isStatic: true,
            render: {
                fillStyle: color,
                strokeStyle: color
            }
        }, true);

        World.add(world, terrain);

        var bodyOptions = {
            frictionAir: 0,
            friction: 0.0001,
            restitution: 0.6
        };

        //terrain.

        /*World.add(world, Composites.stack(300, 100, 1, 1, 10, 10, function (x, y) {
            if (Query.point([terrain], { x: x, y: y }).length === 0) {
                return Bodies.polygon(x, y, 10, 10, bodyOptions);
            }
        }));*/


        var ball = function (e) {
            console.log(e);
            //var xPos = e.originalEvent.touches[0].pageX;
            return Bodies.circle(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, 10, {
            },25);
        }

        /*$('body').on('touchstart', function (e) {
            World.add(world, ball(e));
        })*/

        $(document).on('touchstart', 'body', function (e) {
            World.add(world, ball(e));
        });
    });

    var renderOptions = render.options;
    renderOptions.showAngleIndicator = false;
    renderOptions.showVelocity = true;
}