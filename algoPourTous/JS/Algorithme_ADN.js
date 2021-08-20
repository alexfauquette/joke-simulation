function Algorithme_ADN(id_canvas, x0, y0, dx, dy, tableau){
	this.pinceau = document.getElementById(id_canvas).getContext("2d");

	//coordonnées initiales
	this.x0 = x0;
	this.y0 = y0;
	//distance du canvas alloué au dessin de ce tableau
	this.limX = dx;
	this.limY = dy;

	this.tableau = tableau;

	//Declaration des attributs qui serront utils au tracé
	this.L;
	this.l;
	this.H;
	this.police = 18;
	this.txt_1 = [" = ",""," + ",""," = ",""];
	this.txt_2 = [" = ",""," + ",""," = ",""];
	this.txt_3 = [" = ",""," + ",""," = ",""];

	//scores

	this.deletion = -2;
	this.substitution = -1;
	this.match = 1;

	//code couleurs 

	this.couleur1 = "blue";
	this.couleur2 = "#b55dba";
	this.couleur3 = "#6c5dba";
	this.couleur4 = "#f18bfc";
	this.couleur_attente = "orange";
	this.epaisseur_fleches = 2;

	this.y_base_arbre = 280;//coordonnée de base de l'arbre

	this.get_visible = function(){
		var delta = $("#"+id_canvas).offset().top - $(window).scrollTop();
		var hauteur = $("#"+id_canvas).height();

		if(delta < $(window).height()-hauteur/2 && delta > -hauteur/2){
			return true;
		}
		else{
			return false;
		}
	}

	this.initialisation = function(){
		var adn1 = this.tableau.ADN1;
		var adn2 = this.tableau.ADN2;
		this.tableau.creer(adn1,adn2);
		this.pinceau.clearRect(this.x0, this.y0, this.limX, this.limY);

		this.partie = 0;
		this.ETAT = 0;
		this.sub_etat = 0;

		//tailles de la grille a remplire par relation de recurence
		this.Nx = adn1.length;
		this.Ny = adn2.length;

		//efface les commentaires en cours sur l'algorithme
		this.pinceau.clearRect(this.x0, this.y0, this.limX, this.limY);
	}

	
	






	//--------------------------------fonctions pour tracer les commentaires

	this.tracer_alignement = function(x, y, adn1, adn2, police, longueur, couleur){
		if(adn1 == ""){
			adn1 = "_";
		}
		if(adn2 == ""){
			adn2 = "_";
		}
		
		this.pinceau.font = police+'pt Calibri';
		this.pinceau.beginPath();

		// la longueur est soit celle donnée en argument soit la taille  max des deux adn si celle donnée est insuffisante
		var longueur = Math.max(longueur, Math.max(this.pinceau.measureText(adn1).width , this.pinceau.measureText(adn2).width )+10);
		var hauteur = parseInt(this.pinceau.font)*2+20;

		this.pinceau.fillStyle = "white";
		this.pinceau.lineWidth = 3;
		this.pinceau.strokeStyle = couleur;

		this.pinceau.fillRect(x, y, longueur, hauteur);
		this.pinceau.strokeRect(x, y, longueur, hauteur);


		this.pinceau.textAlign = 'left';
		this.pinceau.textBaseline = 'bottom';
		this.pinceau.fillStyle = "black";

		this.pinceau.fillText(adn1, x+5, y+10+parseInt(this.pinceau.font));
		this.pinceau.textBaseline = 'top';
		this.pinceau.fillText(adn2, x+5, y+10+parseInt(this.pinceau.font));

		return [longueur, hauteur];
	}

	this.get_size_alignement = function(adn1, adn2, police){
		this.pinceau.font = police+'pt Calibri';

		// la longueur est soit celle donnée en argument soit la taille  max des deux adn si celle donnée est insuffisante
		var longueur = Math.max(this.pinceau.measureText(adn1).width , this.pinceau.measureText(adn2).width )+10;
		var hauteur = parseInt(this.pinceau.font)*2+20;

		return [longueur, hauteur];
	}

	this.get_size_nucleotide = function(nuc1, nuc2, police){
		this.pinceau.font = police+'pt Calibri';

		// la longueur est soit celle donnée en argument soit la taille  max des deux adn si celle donnée est insuffisante
		var longueur = Math.max(this.pinceau.measureText(nuc1).width , this.pinceau.measureText(nuc2).width )+6;
		var hauteur = parseInt(this.pinceau.font)*2+20;

		return [longueur, hauteur];
	}

	this.tracer_nucleotides = function(x, y, nuc1, nuc2, police){

		if(nuc1 == ""){
			nuc1 = "_";
		}
		if(nuc2 == ""){
			nuc2 = "_";
		}

		this.pinceau.font = police+'pt Calibri';
		this.pinceau.beginPath();
		// la longueur est soit celle donnée en argument soit la taille  max des deux adn si celle donnée est insuffisante
		var longueur = Math.max(this.pinceau.measureText(nuc1).width , this.pinceau.measureText(nuc2).width )+6;
		var hauteur = parseInt(this.pinceau.font)*2+20;
		if(nuc1 == "_" && nuc2 == "_"){
			this.pinceau.fillStyle = "lightgray";
		}
		else if(nuc1 == "_" || nuc2 == "_"){
			this.pinceau.fillStyle = "red";
		}
		else if(nuc1 != nuc2){
			this.pinceau.fillStyle = "orange";
		}
		else{
			this.pinceau.fillStyle = "green";
		}

		this.pinceau.fillRect(x, y+longueur/2, longueur, hauteur-longueur);
		this.pinceau.arc(x+longueur/2, y+longueur/2, longueur/2 , 0 , Math.PI , true);
		this.pinceau.fill();
		this.pinceau.arc(x+longueur/2, y+hauteur-longueur/2, longueur/2 , Math.PI, 0 , true);
		this.pinceau.fill();

		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'bottom';
		this.pinceau.fillStyle = "black";

		

		this.pinceau.fillText(nuc1, x+(longueur/2), y+10+parseInt(this.pinceau.font));
		this.pinceau.textBaseline = 'top';
		this.pinceau.fillText(nuc2, x+longueur/2, y+10+parseInt(this.pinceau.font));

		return longueur;
	}


	this.fleche = function(x1,y1,x2,y2,r,omega,couleur,epaisseur){
		theta = Math.atan((y2-y1) / (x2-x1));
		if(x2 > x1){
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

		this.pinceau.moveTo( x1 , y1 );

		this.pinceau.lineTo( x2, y2);
		this.pinceau.stroke();

		//écart du premier point
		var ax = r*Math.cos(theta+omega);
		var ay = r*Math.sin(theta+omega);

		//écart du premier point
		var bx = r*Math.cos(theta-omega);
		var by = r*Math.sin(theta-omega);

		this.pinceau.beginPath();
			
		this.pinceau.fillStyle = couleur;
		this.pinceau.moveTo(x2,y2);
		this.pinceau.lineTo(x2+ax,y2+ay);
		this.pinceau.lineTo(x2+bx,y2+by);
		this.pinceau.closePath();
		this.pinceau.fill();
		this.pinceau.stroke();
	}

	this.tracer_texte = function(x, y, text, police, couleur1, couleur2){
		var x = x;

		this.pinceau.font = police+'pt Calibri';
		this.pinceau.textAlign = 'left';
		this.pinceau.textBaseline = 'middle';

		this.pinceau.fillStyle = "black";
		this.pinceau.fillText(text[0], x , y);
		x = x + this.pinceau.measureText(text[0]).width;

		this.pinceau.fillStyle = couleur1;
		this.pinceau.fillText(text[1], x , y);
		x = x + this.pinceau.measureText(text[1]).width;

		this.pinceau.fillStyle = "black";
		this.pinceau.fillText(text[2], x , y);
		x = x + this.pinceau.measureText(text[2]).width;


		if(text[3] == this.deletion){
			this.pinceau.fillStyle = "red";
		}
		else if(text[3] == this.substitution){
			this.pinceau.fillStyle = "orange";
		}
		else if(text[3] == this.match){
			this.pinceau.fillStyle = "green";
		}
		this.pinceau.fillText(text[3], x , y);
		x = x + this.pinceau.measureText(text[3]).width;

		this.pinceau.fillStyle = "black";
		this.pinceau.fillText(text[4], x , y);
		x = x + this.pinceau.measureText(text[4]).width;

		this.pinceau.fillStyle = couleur2;
		this.pinceau.fillText(text[5], x , y);
		x = x + this.pinceau.measureText(text[5]).width;
	}
	
	this.changer_couleur_fleches_incidentes = function(ligne,colonne,couleur){
		var reponse = [];
		if(ligne > 0){
			var n = (ligne-1)*(this.Nx+1)+colonne;
			var N = this.tableau.fleche_adjacence[n].length;
			for(var i = 0 ; i < N ; i++){
				if(this.tableau.fleche_adjacence[n][i][0] == ligne && this.tableau.fleche_adjacence[n][i][1] == colonne){
					this.tableau.fleche_adjacence[n][i][2] = couleur;
					reponse.push([ligne-1,colonne]);
				}
			}
		}

		if(colonne > 0){
			var n = (ligne)*(this.Nx+1)+colonne-1;
			var N = this.tableau.fleche_adjacence[n].length;
			for(var i = 0 ; i < N ; i++){
				if(this.tableau.fleche_adjacence[n][i][0] == ligne && this.tableau.fleche_adjacence[n][i][1] == colonne){
					this.tableau.fleche_adjacence[n][i][2] = couleur;
					reponse.push([ligne,colonne-1]);
				}
			}
		}

		if(ligne > 0 && colonne > 0){
			var n = (ligne-1)*(this.Nx+1)+colonne-1;
			var N = this.tableau.fleche_adjacence[n].length;
			for(var i = 0 ; i < N ; i++){
				if(this.tableau.fleche_adjacence[n][i][0] == ligne && this.tableau.fleche_adjacence[n][i][1] == colonne){
					this.tableau.fleche_adjacence[n][i][2] = couleur;
					reponse.push([ligne-1,colonne-1]);
				}
			}
		}

		return reponse;
	}

	this.supprimer_fleches = function(ligne, colonne, couleur){
		//supprime de la memoire les fleches venant de la ligne, colonne et donc la couleur est ... couleur ! ^^
		var n = ligne*(this.Nx+1)+colonne;
		var N = this.tableau.fleche_adjacence[n].length;
		for(var i = N-1 ; i >=0 ; i--){
			if(this.tableau.fleche_adjacence[n][i][2] == couleur){
				this.tableau.fleche_adjacence[n].splice(i, 1);
			}
		}
	}


	this.chercher_reponses = function(){
		var rep = [];
		var pile = [ [ "","",[0],[0],[] ] ];
		while(pile.length != 0){
			var element = pile.pop();
			var ligne = element[2][element[2].length-1];
			var colonne = element[3][element[3].length-1];
			if(ligne == this.Ny && colonne == this.Nx){
				rep.push(element);
			}
			else{
				var n = ligne*(this.Nx+1)+colonne;
				var N = this.tableau.fleche_adjacence[n].length;
				for(var i = 0 ; i < N ; i++){
					var new_ligne = this.tableau.fleche_adjacence[n][i][0];
					var new_colonne = this.tableau.fleche_adjacence[n][i][1];
					var new_liste = [];

					//nouveau adn1
					if(new_colonne == colonne){
						new_liste.push(element[0]+"_");
					}
					else{
						new_liste.push(element[0]+this.tableau.ADN1.substring(colonne,new_colonne));
					}

					//nouveau adn2
					if(new_ligne == ligne){
						new_liste.push(element[1]+"_");
					}
					else{
						new_liste.push(element[1]+this.tableau.ADN2.substring(ligne,new_ligne));
					}

					//nouvelle ligne
					new_liste.push(element[2].slice());
					new_liste[2].push(new_ligne);

					//nouvelle colonne
					new_liste.push(element[3].slice());
					new_liste[3].push(new_colonne);

					//nouvel id_fleche
					new_liste.push(element[4].slice());
					new_liste[4].push(i);

					pile.push(new_liste);	
				}

			}
		}

		return rep;	
	}

	this.suivant = function(afficher, afficher_explication){
		
		// ---------------------------- initialisation des premieres cases ------------------------------
		
		if(this.partie == 0){
			if(this.ETAT <= this.Nx){
				var ligne = 0;
				var colonne = this.ETAT;
			}
			else{
				var colonne = 0;
				var ligne = this.ETAT-this.Nx;
			}

			if(this.sub_etat == 0){
				//entourer la case qui serra traitée et nettoyer la partie algo et le dernier tracé
				this.tableau.encercler(afficher, ligne, colonne, "blue", "");


				if(afficher_explication){
					this.pinceau.font = this.police+'pt Calibri';

					this.pinceau.textAlign = 'center';
					this.pinceau.textBaseline = 'middle';
					this.pinceau.fillStyle = "black";
					this.pinceau.fillText("On cherche le score maximal de : ", this.x0+this.limX/2 , this.y0 + 20);

					var police = this.police;

					[this.L, this.H] = this.get_size_alignement(this.tableau.ADN1.substring(0, colonne) , this.tableau.ADN2.substring(0, ligne) , police);
					[this.l, this.h] = this.get_size_nucleotide("A" , "T" , police);

					while(police > 8 && 2*this.L+this.l+this.pinceau.measureText(" = ") > this.limX-20){
						police = police - 1;
						this.pinceau.font = this.police+'pt Calibri';
						[this.L, this.H] = this.get_size_alignement(this.tableau.ADN1.substring(0, colonne) , this.tableau.ADN2.substring(0, ligne) , police);
						[this.l, this.h] = this.get_size_nucleotide("A" , "T" , police);
					}

					this.police_actuelle = police;

					this.tracer_alignement(this.x0+this.limX/2-this.L/2 , this.y0+50 , this.tableau.ADN1.substring(0, colonne) , this.tableau.ADN2.substring(0, ligne) , this.police_actuelle , this.L , this.couleur1);
				}


			}
			else if(this.sub_etat == 1){
				//afficher le calcul qui donne le resultat et la fleche reliant les sommets
				if(ligne>0){
					this.tableau.fleche(afficher , ligne-1, colonne, ligne, colonne, "blue", this.epaisseur_fleches);
					this.tableau.encercler(afficher, ligne-1, colonne, this.couleur2 , "");
					if(afficher_explication){
						var nuc2 = this.tableau.ADN2.substring(ligne-1,ligne);
						var nuc1 = "";
						var adn1_1 = "";
						var adn1_2 = "";
						var adn2_1 = this.tableau.ADN2.substring(0,ligne);
						var adn2_2 = this.tableau.ADN2.substring(0,ligne-1);
					}
				}
				else if(colonne>0){
					this.tableau.fleche(afficher , ligne, colonne-1, ligne, colonne, "blue", this.epaisseur_fleches);
					this.tableau.encercler(afficher, ligne, colonne-1, this.couleur2 , "");
					if(afficher_explication){
						var nuc2 = "";
						var nuc1 = this.tableau.ADN1.substring(colonne-1, colonne);
						var adn1_1 = this.tableau.ADN1.substring(0,colonne);
						var adn1_2 = this.tableau.ADN1.substring(0,colonne-1);
						var adn2_1 = "";
						var adn2_2 = "";
					}
				}

				if(afficher_explication){
					if(ligne > 0 || colonne >0){
						var texte = "Cet alignement finira forcément par : ";
						this.pinceau.font = this.police+'pt Calibri';

						this.pinceau.textAlign = 'center';
						this.pinceau.textBaseline = 'middle';
						this.pinceau.fillStyle = "black";
						this.pinceau.fillText(texte, this.x0+this.limX/2 , this.y0 + 80 + this.H);

						this.tracer_nucleotides(this.x0+this.limX/2+this.pinceau.measureText(texte).width/2 , this.y0 + 80 + this.H - this.h/2 , nuc1 , nuc2 , this.police_actuelle);

						this.pinceau.font = this.police_actuelle+'pt Calibri';

						var x = this.x0+this.limX/2 - (2*this.L + this.l + this.pinceau.measureText(" = ").width)/2;
						var y = this.y0 + 70 + 2*this.H;
						this.tracer_alignement(x , y , adn1_1 , adn2_1 , this.police_actuelle , this.L , this.couleur1);
						x = x + this.L;

						this.pinceau.font = this.police+'pt Calibri';
						this.pinceau.textAlign = 'left';
						this.pinceau.textBaseline = 'middle';

						this.pinceau.fillText(" = ", x , y+this.H/2);

						x = x + this.pinceau.measureText(" = ").width;
						this.tracer_alignement(x , y , adn1_2 , adn2_2 , this.police_actuelle , this.L , this.couleur2);

						x = x + this.L+5;
						this.tracer_nucleotides(x , y , nuc1 , nuc2 , this.police_actuelle);
					}
					else{
						var texte = "Cet alignement serra forcément : ";
						this.pinceau.font = this.police+'pt Calibri';

						this.pinceau.textAlign = 'center';
						this.pinceau.textBaseline = 'middle';
						this.pinceau.fillStyle = "black";
						this.pinceau.fillText(texte, this.x0+this.limX/2 , this.y0 + 80 + this.H);

						this.tracer_nucleotides(this.x0+this.limX/2+this.pinceau.measureText(texte).width/2 , this.y0 + 80 + this.H - this.h/2 , "_" , "_" , this.police_actuelle);

					}
				}
			}







			
			else if(this.sub_etat == 2){
				//mettre le resultat dans le tableau
				this.tableau.set_valeur(ligne, colonne, -2*(ligne+colonne), false, afficher);

				//expliquer le calcul
				if(afficher_explication && (ligne > 0 || colonne > 0)){
					var texte = "Ce qui donne le score maximal suivant : ";
					this.pinceau.font = this.police+'pt Calibri';

					this.pinceau.textAlign = 'center';
					this.pinceau.textBaseline = 'middle';
					this.pinceau.fillStyle = "black";
					this.pinceau.fillText(texte, this.x0+this.limX/2 , this.y0 + 110 + 3*this.H);

					if(ligne>0){
						var score2 = this.tableau.tab[ligne-1][colonne];
					}
					else if(colonne>0){
						var score2 = this.tableau.tab[ligne][colonne-1];
					}

					var score1 = this.tableau.tab[ligne][colonne];

					var large = this.pinceau.measureText(score1 + " = "+score2+" + -2").width;
					var x = this.x0+this.limX/2-large/2;
					var y = this.y0 + 110 + 4*this.H;
					this.pinceau.textAlign = "left";

					this.pinceau.fillStyle = this.couleur1;
					this.pinceau.fillText(score1 , x , y);
					x = x + this.pinceau.measureText(score1+"").width;

					this.pinceau.fillStyle = "black";
					this.pinceau.fillText(" = " , x , y);
					x = x + this.pinceau.measureText(" = ").width;

					this.pinceau.fillStyle = this.couleur2;
					this.pinceau.fillText(score2 , x , y);
					x = x + this.pinceau.measureText(score2+"").width;	

					this.pinceau.fillStyle = "black";
					this.pinceau.fillText(" + " , x , y);
					x = x + this.pinceau.measureText(" + ").width;

					this.pinceau.fillStyle = "red";
					this.pinceau.fillText("-2" , x , y);
				}
				else if(afficher_explication){
					var texte = "Ce qui donne par convention un score de 0";
					this.pinceau.font = this.police+'pt Calibri';

					this.pinceau.textAlign = 'center';
					this.pinceau.textBaseline = 'middle';
					this.pinceau.fillStyle = "black";
					this.pinceau.fillText(texte, this.x0+this.limX/2 , this.y0 + 30 + 3*this.H);
				}

			}

			else if(this.sub_etat == 3){
				//on supprime ce qui doit être supprimé
				this.pinceau.clearRect(this.x0, this.y0, this.limX, this.limY);
				
				if(colonne>0){
					c = colonne - 1;
					l = 0;
					this.tableau.tab_bord[l][c] = "";
					this.tableau.tab_fond[l][c] = "";
					
					if(afficher){
						this.tableau.retracer_case(l,c);
					}
					
				}
				else if(ligne>0){
					c = 0;
					l = ligne - 1;
					this.tableau.tab_bord[l][c] = "";
					this.tableau.tab_fond[l][c] = "";

					if(afficher){
						this.tableau.retracer_case(l,c);
					}
				}

				this.tableau.tab_bord[ligne][colonne] = "";
				this.tableau.tab_fond[ligne][colonne] = "";
				if(afficher){
					this.tableau.retracer_case(ligne,colonne);
				}
			}

			//----------------------traitement de la condition de bouclage ------------------------
			this.sub_etat = this.sub_etat + 1;
			if(this.sub_etat == 4){
				this.sub_etat = 0;
				this.ETAT = this.ETAT+1;
			}
			if(this.ETAT == this.Nx+this.Ny+1){
				this.partie = 1;
				this.ETAT = 0;
			}

		}






		// ---------------------------- relation de récurence ------------------------------

		else if(this.partie == 1){
			var ligne = 1+ Math.floor(this.ETAT/this.Nx);	//On ajoute 1 car la premiere ligne et la première colonne
			var colonne = 1 + this.ETAT%this.Nx;			//sont deja remplie par la partie 0

			this.tableau.encercler(afficher, ligne, colonne, "blue", "");
			
			if(this.sub_etat == 0){			
				

				//--------------------------------------------------------------------------------//
				//----------															----------//
				//----------	Calcule des variables utiles pour la suite des tracés	----------//
				//----------															----------//
				//--------------------------------------------------------------------------------//
				if(afficher_explication){
					//On ecrit les trois textes necessaire:
					this.txt_1[3] = this.deletion+"";
					this.txt_3[3] = this.deletion+"";
					if(this.tableau.ADN1[colonne-1] == this.tableau.ADN2[ligne-1]){
						var diff = this.match;
					}
					else{var diff = this.substitution;}
					this.txt_2[3] = diff;

					this.txt_1[1] = this.tableau.tab[ligne][colonne-1]+"";
					this.txt_1[5] = this.tableau.tab[ligne][colonne-1]+this.deletion+"";

					this.txt_3[1] = this.tableau.tab[ligne-1][colonne]+"";
					this.txt_3[5] = this.tableau.tab[ligne-1][colonne]+this.deletion+"";

					this.txt_2[1] = this.tableau.tab[ligne-1][colonne-1]+"";
					this.txt_2[5] = this.tableau.tab[ligne-1][colonne-1]+diff+"";

					//On va maintenant tester la police a adopter

					var police = this.police;
					this.pinceau.font = police+'pt Calibri';

					this.ecart_text = Math.max( Math.max(this.pinceau.measureText(this.txt_1.toString()).width , this.pinceau.measureText(this.txt_2.toString()).width ) , this.pinceau.measureText(this.txt_3.toString()).width );

					var distances = this.get_size_alignement(this.tableau.ADN1.substring(0, colonne) , this.tableau.ADN2.substring(0, ligne) , police);
					this.L = distances[0];
					this.H = distances[1];

					this.l = this.get_size_nucleotide("G", "_", police)[0];

					while(police > 8 && 2*this.L+this.l+this.H+this.ecart_text > this.limX - 60){
						police = police - 1;
						this.pinceau.font = police+'pt Calibri';

						this.ecart_text = Math.max( Math.max(this.pinceau.measureText(this.txt_1.toString()).width , this.pinceau.measureText(this.txt_2.toString()).width ) , this.pinceau.measureText(this.txt_3.toString()).width );

						[this.L, this.H] = this.get_size_alignement(this.tableau.ADN1.substring(0, colonne) , this.tableau.ADN2.substring(0, ligne) , police);
		
						[this.l , this.h] = this.get_size_nucleotide("G", "_", police);
					}

					this.police_actuelle = police;





				
					// ---------------------------- On trace l'introduction 
					this.pinceau.font = this.police+'pt Calibri';

					this.pinceau.textAlign = 'center';
					this.pinceau.textBaseline = 'middle';
					this.pinceau.fillStyle = "black";
					this.pinceau.fillText("On cherche le score maximal de : ", this.x0+this.limX/2 , this.y0 + 20);
					this.pinceau.fillText("Cet alignement peut finir de 3 manières : ", this.x0+this.limX/2 , this.y0 + 90 + this.H);
					
					this.tracer_alignement(this.x0+this.limX/2-this.L/2 , this.y0+50 , this.tableau.ADN1.substring(0, colonne) , this.tableau.ADN2.substring(0, ligne) , this.police_actuelle , this.L , this.couleur1);
					this.y_base_arbre = this.y0 + 90 + 3*this.H;
				}	

				
			}







			else if(this.sub_etat == 1){
				//creer fleche diagonale
				this.tableau.encercler(afficher, ligne-1, colonne-1, this.couleur2, "");
				this.tableau.fleche(afficher , ligne-1, colonne-1, ligne, colonne, this.couleur_attente, this.epaisseur_fleches);
				
				if(afficher){
					this.tableau.retracer_case(ligne,colonne);
					this.tableau.retracer_case(ligne-1,colonne-1);
				}

				if(afficher_explication){
					//partie commentaire
					this.x_base_arbre = this.x0 + this.limX/2 - (2*this.L+this.l+this.H+this.ecart_text)/2;

					this.tracer_alignement(this.x_base_arbre,this.y_base_arbre,this.tableau.ADN1.substring(0, colonne) , this.tableau.ADN2.substring(0, ligne) , this.police_actuelle , this.L , this.couleur1);

					this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2, 10, 0.5, this.couleur_attente, 4);

					this.tracer_alignement(this.x_base_arbre+this.L+this.H+3,this.y_base_arbre,this.tableau.ADN1.substring(0, colonne-1) , this.tableau.ADN2.substring(0, ligne-1) , this.police_actuelle , this.L , this.couleur2);
					this.tracer_nucleotides(this.x_base_arbre+2*this.L+this.H+10, this.y_base_arbre, this.tableau.ADN1.substring(colonne-1,colonne), this.tableau.ADN2.substring(ligne-1,ligne), this.police_actuelle);

					this.pinceau.font = this.police_actuelle+'pt Calibri';
			
					this.pinceau.textAlign = 'left';
					this.pinceau.textBaseline = 'middle';
					this.pinceau.fillStyle = "black";

					this.tracer_texte( this.x_base_arbre+2*this.L+this.H+10+this.l , this.y_base_arbre+this.H/2 , this.txt_2, this.police_actuelle, this.couleur2, this.couleur1);
				}

			}

			else if(this.sub_etat == 2){
				//creer fleche horizontale
				
				this.tableau.fleche(false , ligne, colonne-1, ligne, colonne, this.couleur_attente, this.epaisseur_fleches);
				this.tableau.encercler(false, ligne, colonne-1, this.couleur3, "");
				if(afficher){
					this.tableau.retracer_case(ligne,colonne);
					this.tableau.retracer_case(ligne,colonne-1);
				}
				
				if(afficher_explication){
					//partie commentaire

					this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2-this.H/3, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2-4*this.H/3, 10, 0.5, this.couleur_attente, 4);

					this.tracer_alignement(this.x_base_arbre+this.L+this.H+3,this.y_base_arbre-4*this.H/3,this.tableau.ADN1.substring(0, colonne-1) , this.tableau.ADN2.substring(0, ligne) , this.police_actuelle , this.L , this.couleur3);
					this.tracer_nucleotides(this.x_base_arbre+2*this.L+this.H+10, this.y_base_arbre-4*this.H/3, this.tableau.ADN1.substring(colonne-1,colonne), "_", this.police_actuelle);

					this.pinceau.font = this.police_actuelle+'pt Calibri';
			
					this.pinceau.textAlign = 'left';
					this.pinceau.textBaseline = 'middle';
					this.pinceau.fillStyle = "black";

					this.tracer_texte( this.x_base_arbre+2*this.L+this.H+10+this.l, this.y_base_arbre+this.H/2-4*this.H/3 , this.txt_1, this.police_actuelle, this.couleur3, this.couleur1);
				}

			}

			else if(this.sub_etat == 3){
				//creer fleche verticale
				this.tableau.fleche(false , ligne-1, colonne, ligne, colonne, this.couleur_attente, this.epaisseur_fleches);
				this.tableau.encercler(false, ligne-1, colonne, this.couleur4, "");
				if(afficher){
					this.tableau.retracer_case(ligne,colonne);
					this.tableau.retracer_case(ligne-1,colonne);
				}

				if(afficher_explication){
					//partie commentaire

					this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2+this.H/3, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2+4*this.H/3, 10, 0.5, this.couleur_attente, 4);

					this.tracer_alignement(this.x_base_arbre+this.L+this.H+3,this.y_base_arbre+4*this.H/3,this.tableau.ADN1.substring(0, colonne) , this.tableau.ADN2.substring(0, ligne-1) , this.police_actuelle , this.L , this.couleur4);
					this.tracer_nucleotides(this.x_base_arbre+2*this.L+this.H+10, this.y_base_arbre+4*this.H/3, "_", this.tableau.ADN2.substring(ligne-1,ligne), this.police_actuelle);

					this.pinceau.font = this.police_actuelle+'pt Calibri';
			
					this.pinceau.textAlign = 'left';
					this.pinceau.textBaseline = 'middle';
					this.pinceau.fillStyle = "black";

					this.tracer_texte(this.x_base_arbre+2*this.L+this.H+10+this.l , this.y_base_arbre+this.H/2+4*this.H/3, this.txt_3, this.police_actuelle, this.couleur4, this.couleur1);
				}	
			}



			else if(this.sub_etat == 4){
				//calculer le meilleur score
				var score1 = this.tableau.tab[ligne][colonne-1]-2;
				var score2 = this.tableau.tab[ligne-1][colonne]-2;
				if(this.tableau.ADN1[colonne-1] == this.tableau.ADN2[ligne-1]){
					var diff = 1;
				}
				else{
					var diff = -1;
				}
				var score3 = this.tableau.tab[ligne-1][colonne-1]+diff;
				var score_max = Math.max(score1, Math.max(score2, score3));

				this.tableau.set_valeur(ligne, colonne, score_max, false, false);
				if(afficher){
					this.tableau.retracer_case(ligne,colonne);
				}


				if(afficher_explication){
					// ---------------------------- On trace l'introduction 
					this.pinceau.font = this.police+'pt Calibri';

					this.pinceau.textAlign = 'center';
					
					this.pinceau.fillStyle = "black";

					this.pinceau.textBaseline = 'bottom';
					this.pinceau.fillText("Le score maximal pouvant être atteint", this.x0+this.limX/2 ,this.y_base_arbre+2*this.H+4*this.H/3);
					this.pinceau.textBaseline = 'top';
					this.pinceau.fillText("est donc : "+score_max, this.x0+this.limX/2 ,this.y_base_arbre+2*this.H+4*this.H/3);
					

				}	

				
			}





			else if(this.sub_etat == 5){

									
					
				var score1 = this.tableau.tab[ligne][colonne-1]-2;
				var score2 = this.tableau.tab[ligne-1][colonne]-2;
				if(this.tableau.ADN1[colonne-1] == this.tableau.ADN2[ligne-1]){
					var diff = 1;
				}
				else{
					var diff = -1;
				}
				var score3 = this.tableau.tab[ligne-1][colonne-1]+diff;
				var score_max = Math.max(score1, Math.max(score2, score3));

				this.tableau.set_valeur(ligne, colonne, score_max, false, afficher);

				var N = this.tableau.fleche_adjacence[(ligne)*(this.Nx+1)+(colonne-1)].length;
				if(score1 == score_max){
					this.tableau.fleche_adjacence[(ligne)*(this.Nx+1)+(colonne-1)][N-1][2] = "green";
					if(afficher_explication){this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2-this.H/3, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2-4*this.H/3, 10, 0.5, "green", 4);}

				}
				else{
					this.tableau.fleche_adjacence[(ligne)*(this.Nx+1)+(colonne-1)][N-1][2] = "red";
					if(afficher_explication){this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2-this.H/3, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2-4*this.H/3, 10, 0.5, "red", 4);}
				}

				var N = this.tableau.fleche_adjacence[(ligne-1)*(this.Nx+1)+(colonne-1)].length;
				if(score3 == score_max){
					this.tableau.fleche_adjacence[(ligne-1)*(this.Nx+1)+(colonne-1)][N-1][2] = "green";
					if(afficher_explication){this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2, 10, 0.5, "green", 4);}

				}
				else{
					this.tableau.fleche_adjacence[(ligne-1)*(this.Nx+1)+(colonne-1)][N-1][2] = "red";
					if(afficher_explication){this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2, 10, 0.5, "red", 4);}
				}

				var N = this.tableau.fleche_adjacence[(ligne-1)*(this.Nx+1)+(colonne)].length;
				if(score2 == score_max){
					this.tableau.fleche_adjacence[(ligne-1)*(this.Nx+1)+(colonne)][N-1][2] = "green";
					if(afficher_explication){this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2+this.H/3, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2+4*this.H/3, 10, 0.5, "green", 4);}

				}
				else{
					this.tableau.fleche_adjacence[(ligne-1)*(this.Nx+1)+(colonne)][N-1][2] = "red";
					if(afficher_explication){this.fleche(this.x_base_arbre+this.L+5, this.y_base_arbre+this.H/2+this.H/3, this.x_base_arbre+this.L+this.H-5, this.y_base_arbre+this.H/2+4*this.H/3, 10, 0.5, "red", 4);}

				}


				if(afficher){
					
					if(afficher){
						//mettre les fleche dans une couleur adaptée
						this.tableau.retracer_case(ligne, colonne);
					}

					if(afficher_explication){
						this.pinceau.font = this.police+'pt Calibri';
						this.pinceau.textAlign = 'center';
						this.pinceau.fillStyle = "black";

						this.pinceau.textBaseline = 'bottom';
						this.pinceau.fillText("On ne retiend que les transitions", this.x0+this.limX/2 ,this.y_base_arbre+2*this.H+4*this.H/3+60);
						this.pinceau.textBaseline = 'top';
						this.pinceau.fillText("qui donnent le score maximal", this.x0+this.limX/2 ,this.y_base_arbre+2*this.H+4*this.H/3+60);
					}
				}
			}


			else if(this.sub_etat == 6){
				//suppression de l'affichage

				this.pinceau.clearRect(this.x0, this.y0, this.limX, this.limY);

				var l = ligne;
				var c = colonne;

				//supprimer les ronds qui ont ete tracé
				this.tableau.tab_fond[l][c] = "";
				this.tableau.tab_bord[l][c] = "";
				this.tableau.tab_fond[l-1][c] = "";
				this.tableau.tab_bord[l-1][c] = "";
				this.tableau.tab_fond[l-1][c-1] = "";
				this.tableau.tab_bord[l-1][c-1] = "";
				this.tableau.tab_fond[l][c-1] = "";
				this.tableau.tab_bord[l][c-1] = "";

				//gerer les fleches qui restent et celles sui partent
				var N = this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c-1)].length;
				for(var i = N-1 ; i >= 0 ; i--){
					if(this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c-1)][i][0] == l && this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c-1)][i][1] == c){
						//si c'est la bonne fleche
						if(this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c-1)][i][2] == "red"){
							this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c-1)].splice(i, 1); 
							break;
						}
						else if(this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c-1)][i][2] == "green"){
							this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c-1)][i][2] = "blue";
							break;
						}
					}
				}

				var N = this.tableau.fleche_adjacence[(l)*(this.Nx+1)+(c-1)].length;
				for(var i = N-1 ; i >= 0 ; i--){
					if(this.tableau.fleche_adjacence[(l)*(this.Nx+1)+(c-1)][i][0] == l && this.tableau.fleche_adjacence[(l)*(this.Nx+1)+(c-1)][i][1] == c){
						//si c'est la bonne fleche
						if(this.tableau.fleche_adjacence[(l)*(this.Nx+1)+(c-1)][i][2] == "red"){
							this.tableau.fleche_adjacence[(l)*(this.Nx+1)+(c-1)].splice(i, 1); 
							break;
						}
						else if(this.tableau.fleche_adjacence[(l)*(this.Nx+1)+(c-1)][i][2] == "green"){
							this.tableau.fleche_adjacence[(l)*(this.Nx+1)+(c-1)][i][2] = "blue";
							break;
						}
					}
				}


				var N = this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c)].length;
				for(var i = N-1 ; i >= 0 ; i--){
					if(this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c)][i][0] == l && this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c)][i][1] == c){
						//si c'est la bonne fleche
						if(this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c)][i][2] == "red"){
							this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c)].splice(i, 1); 
							break;
						}
						else if(this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c)][i][2] == "green"){
							this.tableau.fleche_adjacence[(l-1)*(this.Nx+1)+(c)][i][2] = "blue";
							break;
						}
					}
				}
				if(afficher){
					this.tableau.retracer_case(l,c);
					this.tableau.retracer_case(l-1,c);
					this.tableau.retracer_case(l,c-1);
					this.tableau.retracer_case(l-1,c-1);
				}
			}


			//----------------------------------- gestion de la condition de bouclage------------------
			this.sub_etat = this.sub_etat + 1;
			if(this.sub_etat == 7){
				this.ETAT = this.ETAT + 1;
				this.sub_etat = 0;
			}

			if(this.ETAT == this.Nx*this.Ny){
				this.sub_etat = 0;
				this.ETAT = 0;
				this.partie = 2;
			}
		}











		// ---------------------------- recherche de la réponse ------------------------------

		else if(this.partie == 2){
			if(this.ETAT == 0){


				//dire ce que l'on va faire
				this.pinceau.clearRect(this.x0, this.y0, this.limX, this.limY);
				
				this.pinceau.font = this.police+'pt Calibri';
				this.pinceau.textAlign = 'center';
				this.pinceau.fillStyle = "black";

				this.pinceau.textBaseline = 'bottom';
				this.pinceau.fillText("On ne garde que les transitions qui premettent", this.x0+this.limX/2 ,this.y0+50);
				
				this.pinceau.textBaseline = 'top';
				this.pinceau.fillText("d'aller jusque l'alignement souhaité", this.x0+this.limX/2 ,this.y0+50);

				this.pinceau.fillText("(La case tout en bas à droite)", this.x0+this.limX/2 ,this.y0+100);



				//initialisation du parcourt
				this.pile = [[this.Ny,this.Nx]];
				this.vues = [];
			}

			if(this.ETAT == 1){
				//parcourt en profondeur des chemin donnant la reponse au probleme
				while(this.pile.length > 0){
					[ligne,colonne] = this.pile.shift();

					var nouveaux_sommets = this.changer_couleur_fleches_incidentes(ligne,colonne,"black");
					this.tableau.retracer_case(ligne, colonne);
					this.vues.push([ligne, colonne]);

					var N = nouveaux_sommets.length;
					for(var i = 0 ; i < N ; i++){

						if(this.vues.findIndex(function(x){return x[0] == nouveaux_sommets[i][0] && x[1] == nouveaux_sommets[i][1]}) < 0 && this.pile.findIndex(function(x){return x[0] == nouveaux_sommets[i][0] && x[1] == nouveaux_sommets[i][1]}) < 0){
							this.pile.push(nouveaux_sommets[i]);
						} 
					}
				}

			}

			if(this.ETAT == 2){

				for(var ligne = 0 ; ligne <= this.Ny ; ligne++){
					for(var colonne = 0 ; colonne <= this.Nx ; colonne++){
						this.supprimer_fleches(ligne, colonne, "blue");
						this.tableau.retracer_case(ligne, colonne);
					}
				}


				this.solutions = this.chercher_reponses();
			}




			//condition de bouclage

			if(this.ETAT == 0){
				this.ETAT = 1;
			}
			else if(this.ETAT == 1){
				this.ETAT = 2;
			}

			else if(this.ETAT == 2){
				this.partie = 3;
				this.ETAT = 0;
				this.sub_etat = 0;
			}

		}

		else if(this.partie == 3){
			// Affichage des solutions
			if(this.ETAT == 0){
				//On calcule la taille de la police a utiliser pour afficher les nuclotides
				var police = this.police;
				[this.l, this.h] = this.get_size_nucleotide("A" , "T" , police);
				var N = 0;
				for(var i = 0 ; i<this.solutions.length ; i++){
					N = Math.max(N , Math.max(this.solutions[i][0].length, this.solutions[i][1].length));
				}

				while(N*(this.l+5) > this.limX-30){
					police = police - 1;
					[this.l, this.h] = this.get_size_nucleotide("A" , "T" , police);
				}
				this.police_actuelle = police;

			}


			if(this.ETAT == 1){
				//On remet en noir le chemin précédent

				if(this.sub_etat == 0){
					var s = this.solutions.length-1;
				}
				else{
					var s = this.sub_etat-1;
				}

				var N = this.solutions[s][2].length;
				for(var i = 0 ; i < N-1 ; i++){
					var l = this.solutions[s][2][i];
					var c = this.solutions[s][3][i];
					var n = l*(this.Nx+1)+c;

					this.tableau.fleche_adjacence[n][this.solutions[s][4][i]][2] = "black";
					this.tableau.fleche_adjacence[n][this.solutions[s][4][i]][3] = this.epaisseur_fleches;

					this.tableau.retracer_case(l,c);

				}
			}

			var N = this.solutions[this.sub_etat][2].length;

			this.pinceau.clearRect(this.x0, this.y0, this.limX, this.limY);

			this.pinceau.font = this.police+'pt Calibri';
			this.pinceau.textAlign = 'center';
			this.pinceau.fillStyle = "black";
			this.pinceau.textBaseline = 'bottom';
			this.pinceau.fillText("Voici l'alignement correspondant", this.x0+this.limX/2 ,this.y0+50);
			this.pinceau.textBaseline = 'top';
			this.pinceau.fillText("au chemin tracé", this.x0+this.limX/2 ,this.y0+50);

				

			[this.l, this.h] = this.get_size_nucleotide("A" , "T" , this.police_actuelle);
			var ecart = (this.l+5)*(N-1);	//Il y a N-1 nucleotides, car il y a N fleches
			var x = this.x0+this.limX/2-ecart/2;
			var y = 100;

			for(var i = 0 ; i < N-1 ; i++){
				var nuc1 = this.solutions[this.sub_etat][0][i];
				var nuc2 = this.solutions[this.sub_etat][1][i];
				var l = this.solutions[this.sub_etat][2][i];
				var c = this.solutions[this.sub_etat][3][i];
				var n = l*(this.Nx+1)+c;

				//coordonnes d'arrivée de la fleche
				var l2 = this.tableau.fleche_adjacence[n][this.solutions[this.sub_etat][4][i]][0];
				var c2 = this.tableau.fleche_adjacence[n][this.solutions[this.sub_etat][4][i]][1];
				if(l2 == l+1 && c2 == c+1){
					//si la fleche est en diagonale
					if(this.tableau.ADN1[c2-1] == this.tableau.ADN2[l2-1]){
						this.tableau.fleche_adjacence[n][this.solutions[this.sub_etat][4][i]][2] = "green";
					}
					else{
						this.tableau.fleche_adjacence[n][this.solutions[this.sub_etat][4][i]][2] = "orange";
					}
				}
				else{
					this.tableau.fleche_adjacence[n][this.solutions[this.sub_etat][4][i]][2] = "red";
				}
				this.tableau.fleche_adjacence[n][this.solutions[this.sub_etat][4][i]][3] = 3*this.epaisseur_fleches;

				this.tableau.retracer_case(l,c);
				this.tracer_nucleotides(x, y, nuc1, nuc2, this.police_actuelle);

				x = x + this.l + 5;

			}


			//relation de recurence
			this.sub_etat = (this.sub_etat+1)%this.solutions.length;
			if(this.ETAT == 0){
				this.ETAT = 1;
			}
		}
	}

	this.precedant = function(){
		var e = this.ETAT;
		var p = this.partie;
		var s = this.sub_etat;
		if(e > 0){
			e = e - 1;
		}
		else{
			if(p == 1){
				p = 0;
				e = this.Nx+this.Ny;
			}
			else if(p == 2){
				p = 1;
				e = this.Nx*this.Ny-1;
			}
			else if(p == 3){
				p = 2;
				e = 2; 
			}
			
		}

		this.initialisation();


		while(this.ETAT != e || this.partie != p || this.sub_etat != 0){
			this.suivant(false,false);
		}
		this.tableau.retracer();
	}

	this.suivant_ultra_rapide = function(){
		if(this.partie == 0 || this.partie == 1){
			var p = this.partie;
			while(this.partie == p){
				this.suivant(false, false);
			}
			this.tableau.retracer();
		}
		else{
			this.suivant(true, false);
		}
	}

	this.suivant_rapide = function(){
		if(this.partie == 0 || this.partie == 1){
			var e = this.ETAT;
			var p = this.partie;
			while(this.ETAT == e ){
				this.suivant(false, false);
			}

			if(p == 0){
				if(e <= this.Nx){
					var ligne = 0;
					var colonne = e;
				}
				else{
					var colonne = 0;
					var ligne = e-this.Nx;
				}
				this.tableau.retracer_case(ligne, colonne);
			}

			else if(p == 1){
				var ligne = 1+ Math.floor(e/this.Nx);
				var colonne = 1 + e%this.Nx;
				this.tableau.retracer_case(ligne, colonne);
			}
		}
		else{
			this.suivant(true, true);
		}
	}

	this.changer_ADN = function(adn1,adn2){
		this.tableau.ADN1 = adn1;
		this.tableau.ADN2 = adn2;
		this.initialisation();
	}

	this.modifier_vitesse = function(lvl){
		//fonction qui va modifier la vitesse de la fonction next()
		//  1 -> vitesse normale, avec commentaire
		//  2 -> normal sans commentaire
		//  3 -> ETAT par ETAT
		//  4 -> partie par partie
		if(lvl == 1){
			this.next = function(){
				if( this.get_visible() ){
					this.suivant(true,true);
				}

			};
			var s = this.sub_etat;
			if(s>0){
				this.sub_etat = 0;
				while(this.sub_etat < s){
					this.suivant(true,true);
				}
			}
		}
		else if(lvl == 2){
			this.pinceau.clearRect(this.x0 , this.y0 , this.limX , this.limY);
			this.next = function(){
				if( this.get_visible() ){
					this.suivant(true,false);
				}

			};
		}
		else{
			var p = this.partie;
			var e = this.ETAT;
			if(p <2 && this.sub_etat != 0){ 
				while(this.partie == p && this.ETAT == e){
					this.suivant(true,true);
				}
			}

			if(lvl == 3){
				this.next = function(){
					if( this.get_visible() ){
						this.suivant_rapide();
					}

				};
			}
			else if(lvl == 4){
				this.next = function(){
					if( this.get_visible() ){
						this.suivant_ultra_rapide();
					}

				};
			}
		}
	}

	this.initialisation();
	this.modifier_vitesse(1);

}


