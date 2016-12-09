package;

import nape.util.Debug;
import nape.util.ShapeDebug;
import pixi.core.graphics.Graphics;
import pixi.core.textures.Texture;
import pixi.core.sprites.Sprite;
import pixi.interaction.EventTarget;
import pixi.plugins.app.Application;
import haxe.Timer;

import nape.geom.Vec2;
import nape.phys.Body;
import nape.phys.BodyType;
import nape.shape.Circle;
import nape.shape.Polygon;
import nape.space.Space;
import nape.phys.Material;

class Main extends Application
{

	var _floor:Body;
	var _space:Space;
	var _balls:Array<Sprite>;
	var _pballs:Array<Body>;

	var maxBall:Int = 10;
	var tempBall:Int = 0;
	var test:Test;

	var debug:Debug;
	var ground:Body;
	var fig:Sprite;

	public function new()
	{
		super();
		_init();

		/*var timer:Timer = new Timer(1000);
		timer.run = _addBall;
		_addBall();*/
	}

	function _init()
	{
		backgroundColor = 0x6699FF;
		autoResize = false;
		width = 800;
		height = 700;
		super.start();

		_balls = [];
		_pballs = [];
		_setUpPhysics();

		test = new Test();

		//var p = new PhysicsData();

		//var ground:Body = PhysicsData.createBody("sss");

		ground = test.body;
		ground.type = BodyType.STATIC;
		ground.position.setxy(0,0);
		ground.space = _space;

		var fon = new Graphics();
		fon.beginFill(0x333300);
		fon.drawRect(0, 0, 800, 700);
		fon.endFill();
		fon.interactive = true;
		fon.on("mousedown", _onEvent);
		fon.on("touchstart", _onEvent);
		stage.addChild(fon);

		fig = new Sprite(Texture.fromImage("assets/nape/ssss.png"));
		fig.anchor.set(0, 0);
		stage.addChild(fig);
		
		onUpdate = _onUpdate;
	}

	function _onEvent(target:EventTarget)
	{
		//trace(target.data.global.x);
		var bd = _addBall(target.data.global.x, target.data.global.y);
		bd.applyImpulse(Vec2.weak(0, -200));
	}

	function _onUpdate(elapsedTime:Float)
	{
		_space.step(1 / 60);

		for (i in 0 ... _pballs.length)
		{
			_balls[i].position.x = _pballs[i].position.x;
			_balls[i].position.y = _pballs[i].position.y;
			_balls[i].rotation = _pballs[i].rotation;
		}
		
		/*fig.x = ground.position.x;
		fig.y = ground.position.y;
		fig.rotation = ground.rotation;*/
	}
	
	function _setUpPhysics()
	{
		var gravity = Vec2.weak(0, 600);
		_space = new Space(gravity);

		/*_floor = new Body(BodyType.STATIC);
		_floor.setShapeMaterials(Material.wood());
		_floor.shapes.add(new Polygon(Polygon.rect(0, 595, 800, 1)));
		_floor.space = _space;*/
	}

	function _addBall(_x:Float,_y:Float):Body
	{
		//if ( tempBall < maxBall)
		//{
		var ball:Sprite = new Sprite(Texture.fromImage("assets/nape/ball.png"));
		ball.anchor.set(0.5, 0.5);
		_balls.push(ball);
		stage.addChild(ball);

		var pball:Body = new Body(BodyType.DYNAMIC);
		pball.shapes.add(new Circle(10));
		pball.position.setxy(_x, _y);
		pball.angularVel = 0;
		pball.allowRotation = true;

		pball.setShapeMaterials(Material.wood());
		pball.space = _space;
		_pballs.push(pball);

		tempBall++;
		
		return pball;
		//}
	}

	static function main()
	{
		new Main();
	}
}