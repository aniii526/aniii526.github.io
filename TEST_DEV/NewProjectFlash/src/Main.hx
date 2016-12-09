package;

import flash.display.Bitmap;
import flash.display.BitmapData;
import flash.display.Graphics;
import flash.display.Sprite;
import flash.display.Stage;
import flash.display.StageAlign;
import flash.display.StageScaleMode;
import flash.Lib;
import flash.events.Event;
import flash.events.MouseEvent;
import nape.geom.Vec2;
import nape.phys.Body;
import nape.phys.BodyType;
import nape.phys.Material;
import nape.shape.Circle;
import nape.space.Space;
import nape.util.BitmapDebug;
import nape.util.Debug;

/**
 * ...
 * @author ya
 */

@:bitmap("bin/assets/ssss.png") 
class MyBitmapData extends BitmapData { }

@:bitmap("bin/assets/ball.png") 
class BallBitmapData extends BitmapData { }

class Main extends Sprite
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

		if (stage != null) {
            initialise(null);
        }
        else {
            addEventListener(Event.ADDED_TO_STAGE, initialise);
        }
	}

	function initialise(ev:Event)
	{
		if (ev != null) {
            removeEventListener(Event.ADDED_TO_STAGE, initialise);
        }
		
		_balls = [];
		_pballs = [];
		_setUpPhysics();

		test = new Test();

		//var p = new PhysicsData();

		//var ground:Body = PhysicsData.createBody("sss");

		ground = test.body;
		ground.type = BodyType.STATIC;
		ground.position.setxy(0, 0);
		ground.space = _space;
		
		debug = new BitmapDebug(stage.stageWidth, stage.stageHeight, stage.color);
        addChild(debug.display);

		/*var fon = new Graphics();
		fon.beginFill(0x333300);
		fon.drawRect(0, 0, 800, 700);
		fon.endFill();
		/*fon.interactive = true;
		fon.on("mousedown", _onEvent);
		fon.on("touchstart", _onEvent);
		stage.addChild(fon);*/
		
		var img = new Bitmap( new MyBitmapData(0, 0) );
		
		addChild(img);
		
		//onUpdate = _onUpdate;
		stage.addEventListener(Event.ENTER_FRAME, _onUpdate);
		stage.addEventListener(MouseEvent.CLICK, _onEvent);
	}

	function _onEvent(e:MouseEvent)
	{
		var bd = _addBall(e.stageX, e.stageY);
		bd.applyImpulse(Vec2.weak(0, -80));
	}

	function _onUpdate(elapsedTime:Float)
	{
		_space.step(1 / 60);

		for (i in 0 ... _pballs.length)
		{
			_balls[i].x = _pballs[i].position.x;
			_balls[i].y = _pballs[i].position.y;
			//_balls[i].rotation = (_pballs[i].rotation * 180/Math.PI) % 360;
		}
		
		/*fig.x = ground.position.x-7;
		fig.y = ground.position.y+30;
		fig.rotation = ground.rotation;*/
		
		/*debug.clear();
        debug.draw(_space);
        debug.flush();*/
	}
	
	function _setUpPhysics()
	{
		var gravity = Vec2.weak(0, 400);
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
		var sp = new Sprite();
			var ball = new Bitmap( new BallBitmapData(0, 0) );
		
			ball.x = -ball.width / 2;
			ball.y = -ball.height / 2;
			sp.addChild(ball);
			
		sp.scaleX = sp.scaleY = 0.7;
		stage.addChild(sp);
		_balls.push(sp);
		
		var pball:Body = new Body(BodyType.DYNAMIC);
		pball.shapes.add(new Circle(7));
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
		var stage = Lib.current.stage;
		stage.scaleMode = StageScaleMode.NO_SCALE;
		stage.align = StageAlign.TOP_LEFT;
		
		flash.Lib.current.addChild(new Main());
	}
	
}