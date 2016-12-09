package;

import nape.phys.Body;
import nape.phys.BodyType;
import nape.shape.Shape;
import nape.shape.Polygon;
import nape.shape.Circle;
import nape.geom.Vec2;
import nape.geom.Vec3;
import nape.dynamics.InteractionFilter;
import nape.phys.Material;
import nape.phys.FluidProperties;
import nape.callbacks.CbType;
import nape.callbacks.CbTypeList;
import nape.geom.AABB;

/**
 * ...
 * @author ya
 */
class Test
{
	public var body:Body;

	public function new()
	{
		init();
	}

	function init()
	{
		//bodies = new Hash< {body:Body,anchor:Vec2}>();

		body = new Body();

		var mat = new Material();
		var filt = new InteractionFilter();
		var prop = new FluidProperties();

		var s = new Polygon(
			[   Vec2.weak(227,651.5),  Vec2.weak(184,629.5),  Vec2.weak(0,694.5),  Vec2.weak(227.5,694)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(475.5,652),  Vec2.weak(476,694.5),  Vec2.weak(704.5,694),  Vec2.weak(505,637.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(184,629.5),  Vec2.weak(158,611.5),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(158,611.5),  Vec2.weak(128.5,586),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(128.5,586),  Vec2.weak(106.5,563),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(106.5,563),  Vec2.weak(86.5,538),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(505,637.5),  Vec2.weak(704.5,694),  Vec2.weak(534,619.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(534,619.5),  Vec2.weak(704.5,694),  Vec2.weak(556,602.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(556,602.5),  Vec2.weak(704.5,694),  Vec2.weak(577,583.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(577,583.5),  Vec2.weak(704.5,694),  Vec2.weak(595.5,564)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(595.5,564),  Vec2.weak(704.5,694),  Vec2.weak(620.5,532)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(86.5,538),  Vec2.weak(70.5,514),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(620.5,532),  Vec2.weak(704.5,694),  Vec2.weak(636.5,506)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(1,-0.5),  Vec2.weak(-0.5,0),  Vec2.weak(289,33.5),  Vec2.weak(336,28.5),  Vec2.weak(2,-0.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(70.5,514),  Vec2.weak(54.5,483),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(54.5,483),  Vec2.weak(41.5,448),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(636.5,506),  Vec2.weak(704.5,694),  Vec2.weak(647.5,484)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(647.5,484),  Vec2.weak(704.5,694),  Vec2.weak(662.5,443)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(41.5,448),  Vec2.weak(31.5,403),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(662.5,443),  Vec2.weak(704.5,694),  Vec2.weak(669.5,413)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(669.5,413),  Vec2.weak(704.5,694),  Vec2.weak(673.5,384)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(704.5,694),  Vec2.weak(704,-0.5),  Vec2.weak(674.5,331),  Vec2.weak(673.5,384)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(31.5,403),  Vec2.weak(28.5,374),  Vec2.weak(0,694.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(0,694.5),  Vec2.weak(28.5,374),  Vec2.weak(28.5,331),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(28.5,331),  Vec2.weak(31.5,301),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(31.5,301),  Vec2.weak(35.5,279),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(35.5,279),  Vec2.weak(45.5,243),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(45.5,243),  Vec2.weak(52.5,225),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(52.5,225),  Vec2.weak(67.5,195),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(67.5,195),  Vec2.weak(82.5,171),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(82.5,171),  Vec2.weak(97.5,151),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(97.5,151),  Vec2.weak(136,110.5),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(136,110.5),  Vec2.weak(156,93.5),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(156,93.5),  Vec2.weak(183,74.5),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(183,74.5),  Vec2.weak(233,49.5),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(233,49.5),  Vec2.weak(267,38.5),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(267,38.5),  Vec2.weak(289,33.5),  Vec2.weak(-0.5,0)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(674.5,331),  Vec2.weak(704,-0.5),  Vec2.weak(671.5,301)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(671.5,301),  Vec2.weak(704,-0.5),  Vec2.weak(667.5,279)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(667.5,279),  Vec2.weak(704,-0.5),  Vec2.weak(653.5,233)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(653.5,233),  Vec2.weak(704,-0.5),  Vec2.weak(637.5,199)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(637.5,199),  Vec2.weak(704,-0.5),  Vec2.weak(627.5,182)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(627.5,182),  Vec2.weak(704,-0.5),  Vec2.weak(608.5,155)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(608.5,155),  Vec2.weak(704,-0.5),  Vec2.weak(590.5,134)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(590.5,134),  Vec2.weak(704,-0.5),  Vec2.weak(570.5,114)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(570.5,114),  Vec2.weak(704,-0.5),  Vec2.weak(549,95.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(549,95.5),  Vec2.weak(704,-0.5),  Vec2.weak(519,74.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(519,74.5),  Vec2.weak(704,-0.5),  Vec2.weak(500,63.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(500,63.5),  Vec2.weak(704,-0.5),  Vec2.weak(472,50.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(472,50.5),  Vec2.weak(704,-0.5),  Vec2.weak(443,40.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(443,40.5),  Vec2.weak(704,-0.5),  Vec2.weak(412,33.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(412,33.5),  Vec2.weak(704,-0.5),  Vec2.weak(383,29.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var s = new Polygon(
			[   Vec2.weak(704,-0.5),  Vec2.weak(2,-0.5),  Vec2.weak(336,28.5),  Vec2.weak(383,29.5)   ],
			mat,
			filt
		);
		s.body = body;
		s.sensorEnabled = false;
		s.fluidEnabled = false;
		s.fluidProperties = prop;
		

		var anchor = if (true) body.localCOM.copy() else Vec2.get(0,695);
		//body.translateShapes(Vec2.weak(-anchor.x,-anchor.y));
		body.position.setxy(0,0);

		//bodies.set("sss", {body:body,anchor:anchor});

	}

}