BezDecelerator = {};

function CubicBezier(P0, P1, P2, P3)
{
    let scalar = function(t, p0, p1, p2, p3){

        var res =   p0*(1-t)*(1-t)*(1-t) 
					+ 3.0 * p1 * (1-t)*(1-t)*t 
					+ 3.0 * p2 * (1 - t)* t * t 
					+ p3*t*t*t;
        return res;

    };

    let resFunc = function(t){
        let x = scalar(t, P0[0], P1[0], P2[0], P3[0]);
        let y = scalar(t, P0[1], P1[1], P2[1], P3[1]);
        return [x,y];
    };

    return resFunc;
}
function QuadraticBezier(P0, P1, P2)
 {
    let scalar = function(t, p0, p1, p2, p3){
        var res =   p0*(1-t)*(1-t) 
					+ 2.0 * p1 * (1-t)*t 
					+ p2*t*t;
        return res;

    };
    let resFunc = function(t){
        let x = scalar(t, P0[0], P1[0], P2[0]);
        let y = scalar(t, P0[1], P1[1], P2[1]);
        return [x,y];
    };

    return resFunc;
}

BezDecelerator.class = function Decelerator(v0, vF, tF, dF)
{
	// just changing the notation to what I am using
    var V = v0;
    var T = tF;
    var D = dF;
    let P0 = [], P1 = [], P2 = [], P3 = [];
    let func;
    const threshold = 0.1;
    if( v0 == 0 )
	{
        throw new Error('no change in velocity not implemented');
    } 
	// Terminal velocity is zero - fit with quadratic
    else if( vF ==  0)
	{
        let P0 = [0.0,0.0];
        let P2 = [T,D];
        let P1 = [D/V, D];
        func = QuadraticBezier(P0, P1, P2);
    }
	// terminal velocity is low enough (slower than D/T) to simply slow down gradually to achieve goal
	// hence can fit with a quadratic bezier
    else if( (vF > 0) && ((D - vF*T) >= (threshold * D) ) )
	{
        let P0 = [0.0,0.0];
        let P2 = [T,D];
        let p1_x = (D - vF*T)/(v0 - vF);
        let p1_y = (v0*p1_x);
        func = QuadraticBezier(P0, [p1_x, p1_y], P2);
    }
	// terminal velocity higher than D/T or only just a little bit less that D/T 
	// and hence requires some speed up towards the end
	// needs a cubic bezier to fit
    else if( (vF > 0) && ((D - vF*T) <=  (1.0 * threshold * D) ) )
	{
        let P0 = [0.0, 0.0];
        let P1 = [D/V, D];
        let P3 = [T,D];
        let p2_x = T - D/vF; 
        let p2_y = 0.0; 
        let P2 = [p2_x, p2_y];
        let alpha = .75;

        let P1_adj = [P1[0]*alpha, P1[1]*alpha];

		// attempts to add a stretch factor .. seems to work for alpha 0.0 .. 1.0
        let P2_adj = [T - D*alpha/vF, D*(1.0 - alpha)]; // alpha 0 .. 1

        func = CubicBezier(P0, P1_adj, P2_adj, P3);
    }
	// terminal velocity is close to D/T and simply produces a straightline equal to D/T 
	// does not seem like a good answer
	// THIS SHOULD BE OBSOLETE
    else if( (vF > 0) && ((D - vF*T) <= (threshold * D) ) && ((D - vF*T) >=  (-1.0 * threshold * D) ) )
	{
        throw new Error('dont know what to do with these velocities');
        let P0 = [0.0, 0.0];
        let P1 = [D/V, D];
        let P3 = [T,D];
        let p2_x = T - D/vF; 
        let p2_y = 0.0; 
        let P2 = [p2_x, p2_y];
        let alpha = .75;

        let P1_adj = [P1[0]*alpha, P1[1]*alpha];

		// attempts to add a stretch factor .. seems to work for alpha 0.0 .. 1.0
        let P2_adj = [T - D*alpha/vF, D*(1.0 - alpha)]; // alpha 0 .. 1

        func = CubicBezier(P0, P1_adj, P2_adj, P3);	
    }
	// should not be any more cases
    else
	{
        throw new Error('dont know what to do -- not implemented');
    }
	
	// this function is the trajectory of the initial velocity
    this.tangent_initial = function(t)
	{
        return V*t;
    }.bind(this);

	// this function draws the trajectory of the final velocity
    this.tangent_final = function(t)
	{
        let res =  vF*t + (D - vF*T);
        return res;
    }.bind(this);

	/*
	* p is a parameter in the range 0..T - its the time point 
	*/
    this.getDistance = function(p)
    {
    	let t = p/T;  // value of the bezier parameter t in rnage 0..1
    	let b_point = func(t);
    	return b_point;

    }.bind(this);
};
