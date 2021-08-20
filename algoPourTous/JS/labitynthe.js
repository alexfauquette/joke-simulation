function Labyrinthe(id_canvas,couleursNormal,couleursEntree,couleursSortie,couleursAttente,couleursVue,couleurMur,couleurVoisins,x0,y0,dx,dy,Nx,Ny,entrees,sorties,murs){
	//couleurs... = [couleurFond , couleurTexte]
	
	this.pinceau = document.getElementById(id_canvas).getContext('2d');

	//couleur du tracé
	this.couleursNormal = couleursNormal;
	this.couleursEntree = couleursEntree;
	this.couleursSortie = couleursSortie;
	this.couleursAttente = couleursAttente;
	this.couleursVue = couleursVue;
	this.couleurMur = couleurMur;
	this.couleurVoisins = couleurVoisins;

	//coordonnees du dessin
	this.x0 = x0;
	this.y0 = y0;
	this.dx = dx;
	this.dy = dy;

	//dimentionnement de la grille
	this.Nx = Nx;
	this.Ny = Ny;
	
	//extremitees
	this.entrees = entrees;
	this.sorties = sorties;


	this.murs = murs;//liste des doublets de cases non joignables


	this.liste_adjecence = [];//Attention, la case [i] correspond au sommet i+1 mais ce qu'elle contient est bien le numero des voisins

	this.etats = [];//etats[n-1] correspond a letat du sommet n -> 0=rien/1=entree/2=sortie/3=attente/4=vue

	for(var i = 1 ; i<=Nx*Ny ; i++){
		var voisins = [];
		if(i>Nx){//Il y a un voisin superieur
			voisins.push(i-Nx);
		}
		if(i<=Nx*(Ny-1)){//Il y a un voisin inferieur
			voisins.push(i+Nx);
		}
		if((i-1)%Nx != 0){//Il y a un voisin a gauche
			voisins.push(i-1);
		}
		if(i%Nx != 0){//Il y a un voisin a droite
			voisins.push(i+1);
		}

		this.liste_adjecence.push(voisins);

		if(this.sorties.indexOf(i)>=0){//c'est une sortie
			this.etats.push(2);
		}
		else if(this.entrees.indexOf(i)>=0){//c'est une entree
			this.etats.push(1);
		}
		else{//Il n'a rien de special
			this.etats.push(0);
		}
	}

	//on supprime les liens créés par les murs
	for(var j = 0 ; j<this.murs.length ; j++){
		var case1 = this.murs[j][0];
		var case2 = this.murs[j][1];

		var i1 = this.liste_adjecence[case1-1].indexOf(case2);
		var i2 = this.liste_adjecence[case2-1].indexOf(case1);
	
		if(i1>=0){this.liste_adjecence[case1-1].splice(i1,1);}
		if(i2>=0){this.liste_adjecence[case2-1].splice(i2,1);}
	}

	// Calcul des dimentions

	this.caseX = Math.round(this.dx/(this.Nx*1.2));//On considere qu'il y a 1.1*N cases, ce qui laisse 10% pour les bordures
	this.caseY = Math.round(this.dy/(this.Ny*1.2));

	this.bordure = Math.min( Math.round( (this.dx-this.Nx*this.caseX)/(this.Nx-1) ) , Math.round( (this.dy-this.Ny*this.caseY)/(this.Ny-1) ) );

	this.initialisation = function(){
		this.etats = [];//etats[n-1] correspond a letat du sommet n -> 0=rien/1=entree/2=sortie/3=attente/4=vue

		for(var i = 1 ; i<=Nx*Ny ; i++){
			if(this.sorties.indexOf(i)>=0){//c'est une sortie
				this.etats.push(2);
			}
			else if(this.entrees.indexOf(i)>=0){//c'est une entree
				this.etats.push(1);
			}
			else{//Il n'a rien de special
				this.etats.push(0);
			}
		}
	}

	this.nettoyer = function(){
		this.pinceau.beginPath();
		this.pinceau.fillStyle = "white";
		
		this.pinceau.rect(this.x0-2, this.y0-2, this.dx+4, this.dy+4);
		
		this.pinceau.fill();
	}

	this.tracer_element = function(txt, x, y, couleurs){

		this.pinceau.beginPath();
		//this.pinceau.lineWidth = 1;
		//this.pinceau.strokeStyle = "black";
		this.pinceau.fillStyle = couleurs[0];
		this.pinceau.rect(x, y, this.caseX, this.caseY);
		this.pinceau.fill();	
		//this.pinceau.stroke();


		this.pinceau.fillStyle = couleurs[1];

		//On recherche la bonne police
		var police = 20;
		this.pinceau.font = police+'pt Calibri';
				
		while(this.pinceau.measureText(this.Nx*this.Ny).width > this.caseX-2 || parseInt(this.pinceau.font) > this.caseY-2){//tant que le texte ne rentre pas
			police = police-1;
			this.pinceau.font = police+'pt Calibri';
		}
		//----------------------------------------------------

		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'middle';
			
		this.pinceau.fillText(txt, x+this.caseX/2, y+this.caseY/2);

	}

	this.tracer_cadre = function(x, y, couleur, epaisseur){
		this.pinceau.beginPath();
		this.pinceau.lineWidth = 2*epaisseur;
		this.pinceau.strokeStyle =  couleur;
		this.pinceau.rect(x+epaisseur, y+epaisseur, this.caseX-2*epaisseur, this.caseY-2*epaisseur);
		this.pinceau.stroke();
	}

	this.tracer_tout = function(){
		for(var n = 1 ; n <= this.Nx*this.Ny ; n++){
			var ligne = ((n-1)-(n-1)%this.Nx)/this.Nx;
			var colonne = (n-1)%this.Nx;

			var x = this.x0+colonne*(this.caseX+this.bordure);
			var y = this.y0+ligne*(this.caseY+this.bordure);


			if(this.etats[n-1]==1){//Si c'est une entree
				this.tracer_element(n, x, y, this.couleursEntree);
			}
			else if(this.etats[n-1]==2){//Si c'est une sortie
				this.tracer_element(n, x, y, this.couleursSortie);
			}
			else if(this.etats[n-1]==0){//Si c'est une sortie
				this.tracer_element(n, x, y, this.couleursNormal);
			}
			else if(this.etats[n-1]==3){//Si c'est une sortie
				this.tracer_element(n, x, y, this.couleursAttente);
			}
			else if(this.etats[n-1]==4){//Si c'est une sortie
				this.tracer_element(n, x, y, this.couleursVue);
			}

			var up = true;
			var left = true;
			var right = true;
			var down = true;

			if(colonne != 0){
				left = false;
			}
			if(ligne != 0){
				up = false;
			}

			if(this.entrees.indexOf(n)>=0 || this.sorties.indexOf(n)>=0 ){
				if(colonne == 0){
					left = false;
				}
				if(ligne == 0){
					up = false;
				}
				if(colonne == this.Nx-1){
					right = false;
				}
				if(ligne == this.Ny-1){
					down = false;
				}
			}

			if(colonne != this.Nx-1 && this.liste_adjecence[n-1].indexOf(n+1)>=0){
				right = false;
			}
			if(ligne != this.Ny-1 && this.liste_adjecence[n-1].indexOf(n+this.Nx)>=0){
				down = false;
			}

			if(up){
				this.pinceau.beginPath();
				this.pinceau.strokeStyle = this.couleurMur;
				this.pinceau.lineWidth = 3;
				this.pinceau.lineCap = "round"; 
	
				this.pinceau.beginPath();
					
				this.pinceau.moveTo(x-this.bordure/2,y-this.bordure/2);
				this.pinceau.lineTo(x+this.caseX+this.bordure/2,y-this.bordure/2);
				
				this.pinceau.stroke();
			}
			if(left){
				this.pinceau.beginPath();
				this.pinceau.strokeStyle = this.couleurMur;
				this.pinceau.lineWidth = 3; 
				this.pinceau.lineCap = "round"; 

				this.pinceau.beginPath();
					
				this.pinceau.moveTo(x-this.bordure/2,y-this.bordure/2);
				this.pinceau.lineTo(x-this.bordure/2,y+this.caseY+this.bordure/2);

				this.pinceau.stroke();
			}
			if(right){
				this.pinceau.beginPath();
				this.pinceau.strokeStyle = this.couleurMur;
				this.pinceau.lineWidth = 3; 
				this.pinceau.lineCap = "round"; 

				this.pinceau.beginPath();
					
				this.pinceau.moveTo(x+this.caseX+this.bordure/2,y-this.bordure/2);
				this.pinceau.lineTo(x+this.caseX+this.bordure/2,y+this.caseY+this.bordure/2);
				
				this.pinceau.stroke();
			}
			if(down){
				this.pinceau.beginPath();
				this.pinceau.strokeStyle = this.couleurMur;
				this.pinceau.lineWidth = 3;
				this.pinceau.lineCap = "round"; 
	
				this.pinceau.beginPath();
					
				this.pinceau.moveTo(x-this.bordure/2,y+this.caseY+this.bordure/2);
				this.pinceau.lineTo(x+this.caseX+this.bordure/2,y+this.caseY+this.bordure/2);
				
				this.pinceau.stroke();
			}
		}
	}

	this.voisins = function(i,animation){
		var ligne = ((i-1)-(i-1)%this.Nx)/this.Nx;
		var colonne = (i-1)%this.Nx;

		var x = this.x0+colonne*(this.caseX+this.bordure);
		var y = this.y0+ligne*(this.caseY+this.bordure);

		var rep = [];
		if(ligne != 0 && this.liste_adjecence[i-1].indexOf(i-this.Nx) >=0){
			rep.push(i-this.Nx);
		}
		if(colonne != this.Nx-1 && this.liste_adjecence[i-1].indexOf(i+1) >=0){
			rep.push(i+1);
		}
		if(ligne != this.Ny-1 && this.liste_adjecence[i-1].indexOf(i+this.Nx) >=0){
			rep.push(i+this.Nx);
		}
		if(colonne != 0 && this.liste_adjecence[i-1].indexOf(i-1) >=0){
			rep.push(i-1);
		}
		

		return rep;

	}

	this.annuler_cadres = function(liste){
		//pour chaque element de la liste, on le retrace pour supprimer les cadres qu'on a ajouté précédement
		for(var k = 0 ; k < liste.length ; k++){
			var n = liste[k];
			var l = ((n-1)-(n-1)%this.Nx)/this.Nx;
			var c = (n-1)%this.Nx;
			var x = this.x0+c*(this.caseX+this.bordure);
			var y = this.y0+l*(this.caseY+this.bordure);

			if(this.etats[n-1]==1){//Si c'est une entree
				this.tracer_element(n, x, y, this.couleursEntree);
			}
			else if(this.etats[n-1]==2){//Si c'est une sortie
				this.tracer_element(n, x, y, this.couleursSortie);
			}
			else if(this.etats[n-1]==0){//Si c'est une sortie
				this.tracer_element(n, x, y, this.couleursNormal);
			}
			else if(this.etats[n-1]==3){//Si c'est une sortie
				this.tracer_element(n, x, y, this.couleursAttente);
			}
			else if(this.etats[n-1]==4){//Si c'est une sortie
				this.tracer_element(n, x, y, this.couleursVue);
			}
		}
	}

	this.get_sommet = function(x,y){
		var colonne = (x-this.x0)/(this.caseX+this.bordure);
		var ligne = (y-this.y0)/(this.caseY+this.bordure);
		ligne = ligne-ligne%1;
		colonne = colonne-colonne%1;
		//document.getElementById("demo").innerHTML = ligne +" , "+colonne + " ---> " + (1+this.Nx*ligne + colonne);

		if(ligne<this.Ny && colonne<this.Nx){
			return (1+this.Nx*ligne + colonne);
		}
		else{
			return 0;
		}
		
	}
}