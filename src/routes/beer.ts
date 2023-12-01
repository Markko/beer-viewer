import { Router } from "express";

export const router = Router();

import { pool } from "../modules/Database"

router.get('/', async ( req, res ) => { 

	const dbh = await pool.connect();
	
	let { rows: ontap } = await dbh.query('SELECT * FROM beers where on_tap order by tap');

	dbh.release();

	res.render('beer',{
		ontap,
	});

});


interface IconOption {
	value: string;
	label:string;
	selected:boolean;
}

router.get(`/${process.env.EDIT_URL}/edit`, async ( req, res ) => {

	const dbh = await pool.connect();

	let { rows: beers } =  await dbh.query( 'SELECT * FROM beers order by tap, batch DESC' );
	
	await dbh.release();

	const iconOptions:IconOption[] = [
		{ value: "/img/tap.webp", label: "Tap", selected: false },
		{ value: "/img/tap-light.webp", label: "Tap Light", selected: false },
		{ value: "/img/tap-dark.webp", label: "Tap Dark", selected: false},
	];
	for ( let beer of beers ) { 

		beer.iconOptions = [];
		for( const iconOption of iconOptions ) {
			let icon = Object.assign({},iconOption);
			if ( beer.icon == icon.value ) {
				icon.selected = true;
			}
			beer.iconOptions.push( icon );
		}
		
	}

	

	beers.unshift( {name:"New", iconOptions} );

	res.render('edit-beer',{
		beers,
	});

});

router.post(`/${process.env.EDIT_URL}/edit/:batch`, async( req, res) => { 
	
	const body  = req.body;
	const dbh = await pool.connect();
	try{ 
		await dbh.query(`UPDATE beers SET
			name = $2,
			style = $3,
			abv = $4,
			ibu = $5,
			tap = $6,
			colour = $7,
			description = $8,
			on_tap = $9,
			tap_date = COALESCE( tap_date, $10 ),
			icon = $11
			WHERE batch = $1
		`,[ 
			body.batch,
			body.name,
			body.style,
			body.abv || undefined,
			body.ibu || undefined,
			body.tap || undefined,
			body.colour,
			body.description,
			!!body.tap, //booleanify
			body.tap? 'NOW': undefined,
			body.icon,
		]);
	} catch ( err ) { 
		console.error(err);
	}
	dbh.release();

	res.redirect(`/${process.env.EDIT_URL}/edit`);
});

router.post(`/${process.env.EDIT_URL}/edit`, async ( req, res ) => {
	const body  = req.body;
	const dbh = await pool.connect();
	try { 
		await dbh.query( `INSERT INTO beers 
			(
				name,
				style,
				abv,
				ibu,
				tap,
				colour,
				description,
				on_tap,
				tap_date,
				icon
			) values (
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7,
				$8,
				$9,
				$10
			)`,
			[
				body.name,
				body.style,
				body.abv || undefined,
				body.ibu || undefined,
				body.tap || undefined,
				body.colour,
				body.description,
				!!body.tap, //booleanify
				body.tap? 'NOW': undefined,
				body.icon
			]
		);
	} catch ( err ) { 
		console.error(err);
	}
	dbh.release();

	res.redirect(`/${process.env.EDIT_URL}/edit`);

})

