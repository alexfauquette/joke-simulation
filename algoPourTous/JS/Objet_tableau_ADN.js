function Tableau_ADN(id_canvas, x0, y0, dx, dy){
	this.pinceau = document.getElementById(id_canvas).getContext("2d");

	this.marge = 5;
	this.epaisseur = 2;
	//coordonnées initiales
	this.x0 = x0;
	this.y0 = y0;
	//distance du canvas alloué au dessin de ce tableau
	this.limX = dx;
	this.limY = dy;

	//declaration des variables qui serront utilisées
	this.ADN1 = "";
	this.ADN2 = "";

	this.dx = 0;//taille des careaux
	this.dy = 0;

	this.rayon = 0;//rayon des cercles


	this.creer = function(adn1, adn2){
		
		this.ADN1 = adn1;
		this.ADN2 = adn2;

		this.pinceau.clearRect(this.x0, this.y0, this.limX, this.limY);

		//On recherche la bonne police
		var police = 20;
		this.pinceau.font = police+'pt Calibri';
		var retraicicement = false;
		while(police > 8 && ((this.pinceau.measureText("W").width + this.marge)*(adn1.length+2) > this.limX || (parseInt(this.pinceau.font) + this.marge)*(adn2.length + 2) > this.limY)){
			police = police - 1;
			this.pinceau.font = police+'pt Calibri';
			retraicicement = true;

		}

		//on élargie au maximum les marges
		while( (this.pinceau.measureText("W").width + this.marge + 1 )*(adn1.length+2) < this.limX && (parseInt(this.pinceau.font) + this.marge + 1)*(adn2.length + 2) < this.limY){
			this.marge = this.marge + 1;
			if(!retraicicement && this.marge > this.pinceau.measureText("W").width && this.marge > parseInt(this.pinceau.font)){
				//si il n' y a pas eu besoin de reduire la police, et que la marge devient plus grande que le texte lui meme
				//on augmente la police et diminue le texte
				police = police + 1;
				this.pinceau.font = police+'pt Calibri';
				this.marge = 5;
			}
		}

		this.police_max = police;
		this.dx = this.pinceau.measureText("W").width + this.marge;
		this.dy = parseInt(this.pinceau.font) + this.marge;

		this.rayon = Math.min( (this.dx)/3, (this.dy)/3 );

		this.pinceau.lineWidth = this.epaisseur;
		this.pinceau.strokeStyle = "black";
		
		for(var i = 1 ; i < adn1.length+2 ; i ++){

			//tracé des colonnes
			this.pinceau.beginPath();
			this.pinceau.moveTo(this.x0+this.dx*i, this.y0);
			this.pinceau.lineTo(this.x0+this.dx*i, this.y0+this.dy*(adn2.length+2));
			this.pinceau.stroke();


			//écriture dans les entrées vertiales
			this.pinceau.textAlign = 'center';
			this.pinceau.textBaseline = 'middle';				
			if(i==1){
				this.pinceau.fillText("_", this.x0+i*this.dx+this.dx/2, this.y0+this.dy/2);
			}
			else{
				this.pinceau.fillText(adn1[i-2], this.x0+i*this.dx+this.dx/2, this.y0+this.dy/2);
			}
		}


		this.tab = [];
		this.tab_fond = [];
		this.tab_bord = [];
		this.fleche_adjacence = [];//tableau où l'entrée est le numero de la case (numéroté suivant l'ordre de lecture habituel)
		
		for(var j = 1 ; j < adn2.length+2 ; j ++){
			//tracé des lignes
			this.pinceau.beginPath();
			this.pinceau.moveTo(this.x0, this.y0 + this.dy*j);
			this.pinceau.lineTo(this.x0 + this.dx*(adn1.length+2), this.y0 + this.dy*j);
			this.pinceau.stroke();


			//écriture dans les entrées en lignes
			if(j==1){
				this.pinceau.fillText("_", this.x0+this.dx/2, this.y0+j*this.dy+this.dy/2);
			}
			else{
				this.pinceau.fillText(adn2[j-2], this.x0+this.dx/2, this.y0+j*this.dy+this.dy/2);
			}


			//creation du tableau qui servira de memoire rempli initiallement par des ""
			this.tab.push([]);
			this.tab_fond.push([]);
			this.tab_bord.push([]);
		
			for(var i = 1 ; i < adn1.length+2 ; i++){
				this.tab[j-1].push("");
				this.tab_fond[j-1].push("");
				this.tab_bord[j-1].push("");
				this.fleche_adjacence.push([]);
			}
		}
	}

	this.set_valeur = function(ligne, colonne, val, effacer, afficher){
		//permet d'inserer une valeur dans le tableau.
		//ATTENTION : on considére ligne et colonne au sens "informatique" on part donc de 0,1,...
		this.tab[ligne][colonne] = val;
		if(effacer){
			this.pinceau.clearRect(this.x0+(colonne+1)*this.dx+this.epaisseur, this.y0+(ligne+1)*this.dy+this.epaisseur, this.dx-2*this.epaisseur, this.dy-2*this.epaisseur);
			this.tab_bord[ligne][colonne] = "";
			this.tab_fond[ligne][colonne] = "";
		}

		if(afficher){
			police = this.police_max;
			this.pinceau.font = police+'pt Calibri';

			while(police > 8 && (this.pinceau.measureText(-42).width > this.dx-this.marge || parseInt(this.pinceau.font) > this.dy-2*this.epaisseur)){
				police = police - 1;
				this.pinceau.font = police+'pt Calibri';
			}

			this.pinceau.textAlign = 'center';
			this.pinceau.textBaseline = 'middle';
			this.pinceau.fillStyle = "black";
			this.pinceau.fillText(val, this.x0+(colonne+1)*this.dx+this.dx/2, this.y0+(ligne+1)*this.dy+this.dy/2);
		}
	}

	this.encercler = function(afficher,ligne, colonne, couleur_tour, couleur_centre){

		if(ligne >= 0 && ligne <= this.ADN2.length && colonne >= 0 && colonne <= this.ADN1.length ){
			this.tab_fond[ligne][colonne] = couleur_centre;
			this.tab_bord[ligne][colonne] = couleur_tour;

			if(afficher){
				var x = this.x0+(colonne+1)*this.dx+this.dx/2;
				var y = this.y0+(ligne+1)*this.dy+this.dy/2;

				this.pinceau.clearRect(x-this.rayon-3, y-this.rayon-3 , 2*this.rayon+6 , 2*this.rayon+6);

				this.pinceau.beginPath();

				this.pinceau.strokeStyle = couleur_tour;
				this.pinceau.arc(x, y, this.rayon , 0 , Math.PI*2 , true);
				if(couleur_tour != ""){
					this.pinceau.stroke();
				}
				

				if(couleur_centre != ""){
					this.pinceau.fillStyle = couleur_centre;
					this.pinceau.fill();
				}

				this.set_valeur(ligne, colonne, this.tab[ligne][colonne], false, true);
			}
		}
	}

	this.fleche = function(afficher, ligne1, colonne1, ligne2, colonne2, couleur, epaisseur){
		var existe_deja = false;

		var n = ligne1*(this.ADN1.length+1)+colonne1;
		for(var i = 0 ; i < this.fleche_adjacence[n].length ; i++){
			if(this.fleche_adjacence[n][i][0] == ligne2 && this.fleche_adjacence[n][i][1] == colonne2){
				//si c'est une ancienne fleche, on met seulement a jour ses caracteristiques
				this.fleche_adjacence[n][i][2] = couleur;
				this.fleche_adjacence[n][i][3] = epaisseur;
				existe_deja = true;
			}
		}

		if(!existe_deja){//Si c'est un nouvelle fleche
			this.fleche_adjacence[ligne1*(this.ADN1.length+1)+colonne1].push([ligne2, colonne2 , couleur , epaisseur]);
		}
		if(afficher){
			var x1 = this.x0+(colonne1+1)*this.dx+this.dx/2;
			var y1 = this.y0+(ligne1+1)*this.dy+this.dy/2;

			var x2 = this.x0+(colonne2+1)*this.dx+this.dx/2;
			var y2 = this.y0+(ligne2+1)*this.dy+this.dy/2;
			theta = Math.atan((y2-y1) / (x2-x1));
			if(x2 < x1){
				theta = theta + Math.PI;
			}
			if(x2 == x1 && y1 >= y2){
				theta = -Math.PI/2
			}
			else if(x1 == x2){
				theta = Math.PI/2
			}

			this.pinceau.strokeStyle = couleur;
			this.pinceau.lineWidth = epaisseur;
			this.pinceau.beginPath();

			this.pinceau.moveTo( x1+this.rayon*Math.cos(theta) , y1 + this.rayon*Math.sin(theta));

			var x = x2+(this.rayon+2)*Math.cos(theta+Math.PI);
			var y = y2+(this.rayon+2)*Math.sin(theta+Math.PI);

			this.pinceau.lineTo( x, y);
			this.pinceau.stroke();

			theta = theta+Math.PI;
			var r = 5;//rayon du traingle qui faoit la fleche
			var omega = 0.5;//angle en radiant de la pointe de la fleche

			//écart du premier point
			var ax = r*Math.cos(theta+omega);
			var ay = r*Math.sin(theta+omega);

			//écart du premier point
			var bx = r*Math.cos(theta-omega);
			var by = r*Math.sin(theta-omega);

			this.pinceau.beginPath();
				
			this.pinceau.fillStyle = couleur;
			this.pinceau.moveTo(x,y);
			this.pinceau.lineTo(x+ax,y+ay);
			this.pinceau.lineTo(x+bx,y+by);
			this.pinceau.closePath();
			this.pinceau.fill();
			this.pinceau.stroke();
		}
	}

	this.tracer_fleches_from = function(ligne1, colonne1){

		var n = ligne1*(this.ADN1.length+1)+colonne1;
		for(var i = 0 ; i < this.fleche_adjacence[n].length ; i++){
			var ligne2 = this.fleche_adjacence[n][i][0];
			var colonne2 = this.fleche_adjacence[n][i][1];
			var couleur = this.fleche_adjacence[n][i][2];
			var epaisseur = this.fleche_adjacence[n][i][3];
		

			var x1 = this.x0+(colonne1+1)*this.dx+this.dx/2;
			var y1 = this.y0+(ligne1+1)*this.dy+this.dy/2;

			var x2 = this.x0+(colonne2+1)*this.dx+this.dx/2;
			var y2 = this.y0+(ligne2+1)*this.dy+this.dy/2;
			theta = Math.atan((y2-y1) / (x2-x1));
			if(x2 < x1){
				theta = theta + Math.PI;
			}
			if(x2 == x1 && y1 >= y2){
				theta = -Math.PI/2
			}
			else if(x1 == x2){
				theta = Math.PI/2
			}

			this.pinceau.strokeStyle = couleur;
			this.pinceau.lineWidth = epaisseur;
			this.pinceau.beginPath();

			this.pinceau.moveTo( x1+this.rayon*Math.cos(theta) , y1 + this.rayon*Math.sin(theta));

			var x = x2+(this.rayon+2)*Math.cos(theta+Math.PI);
			var y = y2+(this.rayon+2)*Math.sin(theta+Math.PI);

			this.pinceau.lineTo( x, y);
			this.pinceau.stroke();

			theta = theta+Math.PI;
			var r = 5;//rayon du traingle qui faoit la fleche
			var omega = 0.5;//angle en radiant de la pointe de la fleche

			//écart du premier point
			var ax = r*Math.cos(theta+omega);
			var ay = r*Math.sin(theta+omega);

			//écart du premier point
			var bx = r*Math.cos(theta-omega);
			var by = r*Math.sin(theta-omega);

			this.pinceau.beginPath();
				
			this.pinceau.fillStyle = couleur;
			this.pinceau.moveTo(x,y);
			this.pinceau.lineTo(x+ax,y+ay);
			this.pinceau.lineTo(x+bx,y+by);
			this.pinceau.closePath();
			this.pinceau.fill();
			this.pinceau.stroke();
		}
	}

	this.retracer_case = function(ligne, colonne){
		this.pinceau.clearRect(this.x0+this.dx*(colonne+1), this.y0+this.dy*(ligne+1), this.dx, this.dy);

		this.pinceau.lineWidth = this.epaisseur;
		this.pinceau.strokeStyle = "black";
		this.pinceau.fillStyle = "black";

		this.pinceau.beginPath();
		this.pinceau.moveTo(this.x0+this.dx*(colonne+2), this.y0+this.dy*(ligne+1));
		this.pinceau.lineTo(this.x0+this.dx*(colonne+1), this.y0+this.dy*(ligne+1));
		this.pinceau.lineTo(this.x0+this.dx*(colonne+1), this.y0+this.dy*(ligne+2));

		if(ligne < this.ADN2.length){
			this.pinceau.lineTo(this.x0+this.dx*(colonne+2), this.y0+this.dy*(ligne+2));
		}
		this.pinceau.stroke();
		if(colonne < this.ADN1.length){
			this.pinceau.moveTo(this.x0+this.dx*(colonne+2), this.y0+this.dy*(ligne+1));
			this.pinceau.lineTo(this.x0+this.dx*(colonne+2), this.y0+this.dy*(ligne+2));
			this.pinceau.stroke();
		}

		//tracé du cercle

		var x = this.x0+(colonne+1)*this.dx+this.dx/2;
		var y = this.y0+(ligne+1)*this.dy+this.dy/2;

		this.pinceau.beginPath();
		this.pinceau.arc(x, y, this.rayon , 0 , Math.PI*2 , true);

		if(this.tab_bord[ligne][colonne] !== ""){
			this.pinceau.strokeStyle = this.tab_bord[ligne][colonne];
			this.pinceau.stroke();
		}
		

		if(this.tab_fond[ligne][colonne] !== ""){
			this.pinceau.fillStyle = this.tab_fond[ligne][colonne];
			this.pinceau.fill();
		}


		//tracé du texte
		var police = this.police_max;
		this.pinceau.font = police+'pt Calibri';

		while(police > 8 && (this.pinceau.measureText(-42).width > this.dx-this.marge || parseInt(this.pinceau.font) > this.dy-2*this.epaisseur)){
			police = police - 1;
			this.pinceau.font = police+'pt Calibri';
		}

		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'middle';
		this.pinceau.fillStyle = "black";
		this.pinceau.fillText(this.tab[ligne][colonne], this.x0+(colonne+1)*this.dx+this.dx/2, this.y0+(ligne+1)*this.dy+this.dy/2);

		//tracé des fleches
		if(ligne > 0 && colonne >0){
			this.tracer_fleches_from(ligne-1, colonne-1);
			this.tracer_fleches_from(ligne, colonne-1);
			this.tracer_fleches_from(ligne-1, colonne);
		}
		else if(ligne > 0){
			this.tracer_fleches_from(ligne-1, colonne);
		}
		else if(colonne > 0){
			this.tracer_fleches_from(ligne, colonne-1);
		}
		this.tracer_fleches_from(ligne, colonne);
	}
	
	this.retracer = function(){

		this.pinceau.clearRect(this.x0, this.y0, this.limX, this.limY);

		this.pinceau.lineWidth = this.epaisseur;
		this.pinceau.strokeStyle = "black";
		this.pinceau.fillStyle = "black";

		
		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'middle';
		this.pinceau.font = this.police_max+'pt Calibri';

		for(var i = 1 ; i < this.ADN1.length+2 ; i ++){
			//tracé des colonnes
			this.pinceau.beginPath();
			this.pinceau.moveTo(this.x0+this.dx*i, this.y0);
			this.pinceau.lineTo(this.x0+this.dx*i, this.y0+this.dy*(this.ADN2.length+2));
			this.pinceau.stroke();

			//écriture dans les entrées vertiales			
			if(i==1){
				this.pinceau.fillText("_", this.x0+i*this.dx+this.dx/2, this.y0+this.dy/2);
			}
			else{
				this.pinceau.fillText(this.ADN1[i-2], this.x0+i*this.dx+this.dx/2, this.y0+this.dy/2);
			}
		}

		for(var j = 1 ; j < this.ADN2.length+2 ; j ++){
			//tracé des lignes
			this.pinceau.beginPath();

			this.pinceau.strokeStyle = "black";
			this.pinceau.fillStyle = "black";
			this.pinceau.moveTo(this.x0, this.y0 + this.dy*j);
			this.pinceau.lineTo(this.x0 + this.dx*(this.ADN1.length+2), this.y0 + this.dy*j);
			this.pinceau.stroke();

			this.pinceau.font = this.police_max+'pt Calibri';

			//écriture dans les entrées en lignes
			if(j==1){
				this.pinceau.fillText("_", this.x0+this.dx/2, this.y0+j*this.dy+this.dy/2);
			}
			else{
				this.pinceau.fillText(this.ADN2[j-2], this.x0+this.dx/2, this.y0+j*this.dy+this.dy/2);
			}

		
			for(var i = 1 ; i < this.ADN1.length+2 ; i++){
				if(this.tab[j-1][i-1] !== "" || this.tab_bord[j-1][i-1] !== "" || this.tab_fond[j-1][i-1] !== "" ){
					this.encercler(true,j-1, i-1, this.tab_bord[j-1][i-1], this.tab_fond[j-1][i-1]);
				}
			}
		}
		var k;
		for(var j = 0 ; j < this.ADN2.length+1 ; j ++){
			for(var i = 0 ; i < this.ADN1.length+1 ; i++){
				
				this.tracer_fleches_from(j,i);
			}
		}
	}

	this.retracer_lettre = function(ligne, colonne, couleur){
		this.pinceau.fillStyle = couleur;
		
		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'middle';
		this.pinceau.font = this.police_max+'pt Calibri';
		
		if(ligne == -1){
			this.pinceau.clearRect(this.x0+colonne*this.dx+4, this.y0+4, this.dx-8, this.dy-8);

			if(colonne == 1){
				this.pinceau.fillText("_", this.x0+colonne*this.dx+this.dx/2, this.y0+this.dy/2);
			}
			else{
				this.pinceau.fillText(this.ADN1[colonne-2], this.x0+colonne*this.dx+this.dx/2, this.y0+this.dy/2);
			}

		}

		else if(colonne == -1){
			this.pinceau.clearRect(this.x0+4 , this.y0+ligne*this.dy+4, this.dx-8, this.dy-8);

			if(ligne == 1){
				this.pinceau.fillText("_" , this.x0+this.dx/2 , this.y0+ligne*this.dy+this.dy/2);
			}
			else{
				this.pinceau.fillText(this.ADN2[ligne-2] , this.x0+this.dx/2 , this.y0+ligne*this.dy+this.dy/2);
			}
		}

	}

}