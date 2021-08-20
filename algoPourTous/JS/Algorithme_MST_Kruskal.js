function Algorithme_Kruskal(id_canvas1, limX, limY, id_canvas2, id_canvas_commentaire, limXC, limYC, graphe){
	this.pinceau_aretes = document.getElementById(id_canvas1).getContext("2d");
	this.pinceau_sommets = document.getElementById(id_canvas2).getContext("2d");
	this.pinceau_com = document.getElementById(id_canvas_commentaire).getContext("2d");

	this.limXC = limXC;
	this.limYC = limYC;

	//distance du canvas alloué au dessin de ce tableau
	this.limX = limX;
	this.limY = limY;

	//elements manipulés par l'algorithmes
	this.graphe = graphe;

	//variable d'etat du systeme
	this.ETAT = 0;
	this.indice = 0;
	this.nb_aretes_traitees = 0;
	this.aretes_ordonnees = [];
	this.groupes_sommets = [];


	this.tracer_liste_aretes = function(){
		this.pinceau_aretes.clearRect(0,0,this.limX,110);

		this.pinceau_aretes.font = '15pt Calibri';
		this.pinceau_aretes.fillStyle = "black";
		this.pinceau_aretes.strokeStyle = "black";

		this.pinceau_aretes.textBaseline = "middle";
		this.pinceau_aretes.textAlign = 'center';


		this.pinceau_aretes.fillText("aretes : " , 40 , 35);
		this.pinceau_aretes.fillText("poids : ", 40 , 90);

		

		this.pinceau_aretes.lineWidth = 2;

		var N = this.aretes_ordonnees.length;

		this.x_aretes = 100;
		var x = this.x_aretes;
		this.dx_aretes = Math.min((this.limX - 2*x) / N , 40);

		
		for(var i = 0 ; i < N ; i++){
			this.pinceau_aretes.fillText(this.aretes_ordonnees[i][0], x , 15);
			this.pinceau_aretes.fillText(this.aretes_ordonnees[i][1], x , 60);
			this.pinceau_aretes.fillText(this.aretes_ordonnees[i][2], x , 90);

			this.pinceau_aretes.beginPath();
			this.pinceau_aretes.moveTo(x , 25);
			this.pinceau_aretes.lineTo(x , 45);
			this.pinceau_aretes.stroke();

			x = x + this.dx_aretes;
		}
	}

	this.tracer_liste_sommets = function(){

		this.pinceau_sommets.clearRect(0,0,this.limX,80);

		this.pinceau_sommets.font = '15pt Calibri';
		this.pinceau_sommets.fillStyle = "black";
		this.pinceau_sommets.strokeStyle = "black";

		this.pinceau_sommets.textBaseline = "middle";
		this.pinceau_sommets.textAlign = 'left';


		this.pinceau_sommets.fillText("sommets" , 5 , 20);
		this.pinceau_sommets.fillText("sous-graphes", 5 , 60);

		this.pinceau_sommets.textAlign = 'center';

		this.pinceau_sommets.lineWidth = 2;

		var N = this.groupes_sommets.length;

		this.x_sommets = 140;
		var x = this.x_sommets;
		this.dx_sommets = Math.min((this.limX - 2*x) / N , 40);

		this.pinceau_sommets.beginPath();
		this.pinceau_sommets.moveTo(5 , 40);
		this.pinceau_sommets.lineTo(this.x_sommets + (N-0.5) * this.dx_sommets , 40);
		this.pinceau_sommets.stroke();


		this.pinceau_sommets.font = '20pt Calibri';

		for(var i = 0 ; i < N ; i++){
			this.pinceau_sommets.fillText(this.graphe.sommets[i] , x , 22);
			this.pinceau_sommets.fillText(this.groupes_sommets[i] , x , 60);
			

			this.pinceau_sommets.beginPath();
			this.pinceau_sommets.moveTo(x - this.dx_sommets/2 , 5);
			this.pinceau_sommets.lineTo(x - this.dx_sommets/2 , 75);
			this.pinceau_sommets.stroke();

			x = x + this.dx_sommets;
		}

	}

	this.modifier_couleur_sommets = function(indice, ligne, couleur){
		this.pinceau_sommets.font = '20pt Calibri';
		this.pinceau_sommets.fillStyle = couleur;
		this.pinceau_sommets.textBaseline = "middle";
		this.pinceau_sommets.textAlign = 'center';

		var x = this.x_sommets + indice * this.dx_sommets;
		
		if(ligne == 0){
			this.pinceau_sommets.clearRect(x-this.dx_sommets/2+5 , 0 , this.dx_sommets-10 , 35)
			this.pinceau_sommets.fillText(this.graphe.sommets[indice] , x , 22);
		}
		else if(ligne == 1){
			this.pinceau_sommets.clearRect(x-this.dx_sommets/2+5 , 45 , this.dx_sommets-10 , 35)
			this.pinceau_sommets.fillText(this.groupes_sommets[indice] , x , 60);
		}

	}

	this.modifier_couleur_aretes = function(indice, couleur){
		this.pinceau_aretes.font = '15pt Calibri';
		this.pinceau_aretes.fillStyle = couleur;
		this.pinceau_aretes.strokeStyle = couleur;

		this.pinceau_aretes.textBaseline = "middle";
		this.pinceau_aretes.textAlign = 'center';


		this.pinceau_aretes.lineWidth = 2;


		var x = this.x_aretes + indice * this.dx_aretes;

		this.pinceau_aretes.clearRect(x-this.dx_aretes/2 , 0 , this.dx_aretes , 100);

		this.pinceau_aretes.fillText(this.aretes_ordonnees[indice][0], x , 15);
		this.pinceau_aretes.fillText(this.aretes_ordonnees[indice][1], x , 60);
		this.pinceau_aretes.fillText(this.aretes_ordonnees[indice][2], x , 90);

		this.pinceau_aretes.beginPath();
		this.pinceau_aretes.moveTo(x , 25);
		this.pinceau_aretes.lineTo(x , 45);
		this.pinceau_aretes.stroke();
		
	}

	this.initialisation = function(){
		this.indice = 0;
		this.ETAT = 0;
		this.nb_aretes_traitees = 0;
		this.aretes_ordonnees = [];
		this.groupes_sommets = [];

		this.graphe.initialisation();

		var N = this.graphe.aretes.length;


		// ---------------------  On trie les aretes du graphe ------------------------------

		var ponderations = [];
		var indices = [];
		for(var i = 0 ; i < N ; i++){
			ponderations.push(this.graphe.aretes[i].nom);
			indices.push(i);
		}

		var modification = true;
		while(modification){
			modification = false;
			for(var i = 0 ; i < N-1 ; i++){
				if(ponderations[i] > ponderations[i+1]){
					modification = true;
					var tampon1 = ponderations[i];
					var tampon2 = indices[i];

					indices[i] = indices[i+1];
					indices[i+1] = tampon2;

					ponderations[i] = ponderations[i+1];
					ponderations[i+1] = tampon1;
				}
			}
		}

		for(var j = 0 ; j < N ; j++){
			var i = indices[j];
			var n1 = this.graphe.aretes[i].noeud1.nom;
			var n2 = this.graphe.aretes[i].noeud2.nom;
			var p = this.graphe.aretes[i].nom;
			this.aretes_ordonnees.push([ n1 , n2 , p , i]);
		}

		//-----------------------------------------------------------------------
			
		// -------------- On associe a chaque sommet une étiquette ---------------

		var N = this.graphe.sommets.length;

		for(var i = 0 ; i < N ; i ++){
			this.groupes_sommets.push(i);
		}

		//-------------------------------------------------------------------------

	}

	this.suivant = function(afficher){
		
		if(this.ETAT == 0){
			this.initialisation();
			if(afficher){
				this.tracer_liste_aretes();
				this.tracer_liste_sommets();
				this.tracer_etats();
			}
			this.ETAT = 1;
		}

		else if(this.ETAT == 1){
			if(afficher){
				//Effacer la modification precedante
				this.pinceau_com.font = '10pt Calibri';
				this.pinceau_com.fillStyle = "black";

				this.pinceau_com.clearRect(55, 228 , 25, 20);

				this.pinceau_com.textAlign = 'right';
				this.pinceau_com.textBaseline = 'bottom';
				this.pinceau_com.fillText('OUI', 80, 248);

				this.pinceau_com.strokeStyle = 'black';
				this.pinceau_com.lineWidth = 2; 
						
				this.pinceau_com.beginPath();
							
				this.pinceau_com.moveTo(150, 95);
				this.pinceau_com.lineTo(50, 95);
				this.pinceau_com.lineTo(50, 250);
				this.pinceau_com.lineTo(150, 250);
				this.pinceau_com.stroke();

				this.pinceau_com.beginPath();

				this.pinceau_com.moveTo(78, 95);
				this.pinceau_com.lineTo(75, 98);
				this.pinceau_com.lineTo(75, 92);
				this.pinceau_com.closePath();

				this.pinceau_com.stroke();
				this.pinceau_com.fill();

				//retracer le graphe
				this.graphe.tracer(false , 0 , 0);

				var N = this.graphe.sommets.length;
				for(var i = 0 ; i < N ; i++){
					this.modifier_couleur_sommets(i , 1, "black");
				}

				this.tracer_etats();

			}

			if(this.nb_aretes_traitees == this.groupes_sommets.length-1 || this.indice >= this.aretes_ordonnees.length){
				this.ETAT = 8;
			}
			else{
				this.ETAT = 2;
			}
		}

		else if(this.ETAT == 2){
			this.graphe.aretes[this.aretes_ordonnees[this.indice][3]].ETAT = 1;
			if(afficher){
				this.graphe.aretes[this.aretes_ordonnees[this.indice][3]].tracer(true, false);
				this.modifier_couleur_aretes(this.indice , "blue");

				this.tracer_etats();
			}
			this.ETAT = 3;
		}

		else if(this.ETAT == 3){
			var N = this.groupes_sommets.length;
			var n1 = this.aretes_ordonnees[this.indice][0];
			var n2 = this.aretes_ordonnees[this.indice][1];
			for(var j = 0 ; j < N ; j ++){
				if(this.graphe.sommets[j] == n1){
					this.i1 = j;
				}
				if(this.graphe.sommets[j] == n2){
					this.i2 = j;
				}
			}

			if(afficher){
				this.modifier_couleur_sommets(this.i1 , 1, "blue");
				this.modifier_couleur_sommets(this.i2 , 1, "blue");

				this.tracer_etats();
			}

			if(this.groupes_sommets[this.i1] == this.groupes_sommets[this.i2]){
				// Si les deux sommets sont deja reliés
				this.ETAT = 7;
			}
			else{
				this.ETAT = 9;
			}
		}

		else if(this.ETAT == 4){
			this.nb_aretes_traitees++;
			this.graphe.aretes[this.aretes_ordonnees[this.indice][3]].ETAT = 2;
			if(afficher){
				this.graphe.aretes[this.aretes_ordonnees[this.indice][3]].tracer(true, false);
				this.modifier_couleur_aretes(this.indice , "green");

				//Effacer la modification precedante
				this.pinceau_com.font = '10pt Calibri';
				this.pinceau_com.fillStyle = "black";

				this.pinceau_com.clearRect(220, 228 , 30, 20);

				this.pinceau_com.textAlign = 'left';
				this.pinceau_com.textBaseline = 'bottom';
				this.pinceau_com.fillText('NON', 220, 248);

				this.pinceau_com.lineWidth = 2; 
				this.pinceau_com.strokeStyle = "black";


				this.pinceau_com.beginPath();
							
				this.pinceau_com.moveTo(150, 250);
				this.pinceau_com.lineTo(340, 250);
				this.pinceau_com.stroke();

				this.pinceau_com.beginPath();

				this.pinceau_com.moveTo(268, 250);
				this.pinceau_com.lineTo(265, 247);
				this.pinceau_com.lineTo(265, 253);
				this.pinceau_com.closePath();

				this.pinceau_com.stroke();
				this.pinceau_com.fill();

				this.tracer_etats();
			}
			this.ETAT = 5;
		}

		else if(this.ETAT == 5){
			//rechecche des deux sous graphes
			var N = this.graphe.sommets.length;
			for(var i = 0 ; i < N ; i++){
				if(this.groupes_sommets[i] == this.groupes_sommets[this.i1]){
					this.graphe.noeuds[i].ETAT = 1;
					if(afficher){
						this.graphe.noeuds[i].tracer();
						this.modifier_couleur_sommets(i , 1, "#ac00e6");
					}
				}
				else if(this.groupes_sommets[i] == this.groupes_sommets[this.i2]){
					this.graphe.noeuds[i].ETAT = 2;
					if(afficher){
						this.graphe.noeuds[i].tracer();
						this.modifier_couleur_sommets(i , 1, "#4700b3");
					}
				}
			}

			if(afficher){
				this.tracer_etats();
			}
			this.ETAT = 6;
		}

		else if(this.ETAT == 6){
			//On fusionne les sous-graphes
			var N = this.graphe.sommets.length;
			var ref = this.groupes_sommets[this.i2]
			for(var i = 0 ; i < N ; i++){
				if(this.groupes_sommets[i] == ref){
					this.graphe.noeuds[i].ETAT = 1;
					this.groupes_sommets[i] = this.groupes_sommets[this.i1];
					if(afficher){
						this.graphe.noeuds[i].tracer();
						this.modifier_couleur_sommets(i , 1, "#ac00e6");
					}
				}

				this.graphe.noeuds[i].ETAT = 0;//On netoy tout pour le prochain passage
			}

			if(afficher){
				this.tracer_etats();
			}

			this.ETAT = 1;
			this.indice++;
		}

		else if(this.ETAT == 7){
			this.graphe.aretes[this.aretes_ordonnees[this.indice][3]].ETAT = 3;
			if(afficher){
				this.graphe.aretes[this.aretes_ordonnees[this.indice][3]].tracer(true, false);
				this.modifier_couleur_aretes(this.indice , "red");

				this.pinceau_com.font = '10pt Calibri';
				this.pinceau_com.fillStyle = "red";
				this.pinceau_com.strokeStyle = "red";
				this.pinceau_com.textAlign = 'right';
				this.pinceau_com.textBaseline = 'bottom';
				this.pinceau_com.clearRect(55, 228 , 25, 20);
				this.pinceau_com.fillText('OUI', 80, 248);

				this.pinceau_com.lineWidth = 2; 
						
				this.pinceau_com.beginPath();
							
				this.pinceau_com.moveTo(150, 95);
				this.pinceau_com.lineTo(50, 95);
				this.pinceau_com.lineTo(50, 250);
				this.pinceau_com.lineTo(150, 250);
				this.pinceau_com.stroke();

				this.pinceau_com.beginPath();

				this.pinceau_com.moveTo(78, 95);
				this.pinceau_com.lineTo(75, 98);
				this.pinceau_com.lineTo(75, 92);
				this.pinceau_com.closePath();

				this.pinceau_com.stroke();
				this.pinceau_com.fill();

				this.tracer_etats();
			}

			this.ETAT = 1;
			this.indice++;

		}

		else if(this.ETAT == 8){
			var N = this.graphe.aretes.length;

			for(var i = 0 ; i < N ; i++){
				if(this.graphe.aretes[i].ETAT != 2){
					this.graphe.aretes[i].ETAT = 4;
				}
			}
			if(afficher){
				this.graphe.tracer(false, 0 , 0);

				this.tracer_etats();
			}

		}

		else if(this.ETAT == 9){
			if(afficher){
				this.modifier_couleur_sommets(this.i1 , 1, "#ac00e6");
				this.modifier_couleur_sommets(this.i2 , 1, "#4700b3");

				this.pinceau_com.font = '10pt Calibri';
				this.pinceau_com.fillStyle = "green";

				this.pinceau_com.clearRect(220, 228 , 30, 20);
				this.pinceau_com.textAlign = 'left';
				this.pinceau_com.textBaseline = 'bottom';
				this.pinceau_com.fillText('NON', 220, 248);

				this.pinceau_com.lineWidth = 2; 
				this.pinceau_com.strokeStyle = "green";


				this.pinceau_com.beginPath();
							
				this.pinceau_com.moveTo(150, 250);
				this.pinceau_com.lineTo(340, 250);
				this.pinceau_com.stroke();

				this.pinceau_com.beginPath();

				this.pinceau_com.moveTo(268, 250);
				this.pinceau_com.lineTo(265, 247);
				this.pinceau_com.lineTo(265, 253);
				this.pinceau_com.closePath();

				this.pinceau_com.stroke();
				this.pinceau_com.fill();

				this.tracer_etats();
				this.ETAT = 4;
			}
			
			else{
				this.ETAT = 4;
				this.suivant(afficher);
			}
		}
	}


	this.precedant = function(){
		var ind = Math.max(this.indice-1, 0);

		this.initialisation();

		
		this.tracer_liste_aretes();

		while(this.indice < ind){
			this.suivant(false);
		}

		for(var i = 0 ; i < ind; i++){
			if(this.graphe.aretes[this.aretes_ordonnees[i][3]].ETAT == 3){
				this.modifier_couleur_aretes(i,"red");
			}
			else{
				this.modifier_couleur_aretes(i,"green");
			}
		}

		this.graphe.tracer(false, 0, 0);
		this.tracer_etats();
		this.tracer_liste_sommets();
	}

	this.get_visible = function(){
		var delta = $("#"+id_canvas_commentaire).offset().top - $(window).scrollTop();
		var hauteur = $("#"+id_canvas_commentaire).height();
		
		if(delta < $(window).height()-hauteur/2 && delta >-hauteur/2){
			return true;
		}
		else{
			return false;
		}
	}

	// ------------------------ Tracé de l'algo --------------------------------

	this.etats_X = [150, 150, 150, 150, 340, 340, 150, 0, 340];
	this.etats_Y = [25, 95, 180, 250, 250, 325, 325, 0 , 95];
	this.etats_W = [140, 140, 140, 140, 140, 140, 140, 0, 160];
	this.etats_H = [40, 70, 40, 70, 40, 40, 40, 0 , 40];
	this.etats_formes = ['r','l','r','l','r','r','r','','r'];
	this.etats_textes = [['Initialisation'],['n-1 arêtes','conservées ?'],['prendre une arête'],['forme-t-elle','un cycle ?'],["Conserver l'arête"],['repérer les deux','sous-graphes'],['les fusionner'],[''],["n'afficher que les arêtes",'qui ont été conservées']];
	this.couleursNormal = ["white","black"];
	this.couleursActuel = ["green","white"];

	this.tracer_losange = function(x,y,w,h,couleur){
		//Trace un losance dont le centre est en x,y de largeure w et de hauteur h
		//trace du losange
		this.pinceau_com.beginPath();
		this.pinceau_com.moveTo(x,y-h/2);
		this.pinceau_com.lineTo(x+w/2,y);
		this.pinceau_com.lineTo(x,y+h/2);
		this.pinceau_com.lineTo(x-w/2,y);
		this.pinceau_com.closePath();

		//bordure
		this.pinceau_com.lineWidth = 2;
		this.pinceau_com.strokeStyle = "black";
		
		//fond
		this.pinceau_com.fillStyle = couleur;
		
		//trace
		this.pinceau_com.fill();
		this.pinceau_com.stroke();
	}

	this.tracer_rectangle = function(x,y,w,h,couleur){
		//Trace un rectangle dont le centre est en x,y de largeure w et de hauteur h

		this.pinceau_com.beginPath();
		this.pinceau_com.lineWidth = 2;
		this.pinceau_com.strokeStyle = "black";
		this.pinceau_com.fillStyle = couleur;
		
		this.pinceau_com.rect(x-w/2, y-h/2, w, h);
		
		this.pinceau_com.fill();	
		this.pinceau_com.stroke();
	}

	this.tracer_etats = function(){
		for(var etat = 0 ; etat<this.etats_Y.length ; etat++){
			if(this.etats_formes[etat] != ''){
				if(this.ETAT == etat){
					var couleur = this.couleursActuel[0];
					var couleurs_texte = this.couleursActuel[1];
				}
				else{
					var couleur = this.couleursNormal[0];
					var couleurs_texte = this.couleursNormal[1];
				}
				if(this.etats_formes[etat] == 'r'){
					this.tracer_rectangle(this.etats_X[etat],this.etats_Y[etat],this.etats_W[etat],this.etats_H[etat],couleur);
				}
				else if(this.etats_formes[etat] == 'l'){
					this.tracer_losange(this.etats_X[etat],this.etats_Y[etat],this.etats_W[etat],this.etats_H[etat],couleur);
				}
				this.pinceau_com.beginPath();
				
				this.pinceau_com.fillStyle = couleurs_texte;
				this.pinceau_com.font = '11pt Calibri';
				
				this.pinceau_com.textAlign = 'center';

				if(this.etats_textes[etat].length == 1){
					this.pinceau_com.textBaseline = 'middle';
					this.pinceau_com.fillText(this.etats_textes[etat], this.etats_X[etat], this.etats_Y[etat]);
		
				}
				else if(this.etats_textes[etat].length == 2){
					
					this.pinceau_com.textBaseline = 'bottom';
					this.pinceau_com.fillText(this.etats_textes[etat][0], this.etats_X[etat], this.etats_Y[etat]-1);
					
					this.pinceau_com.textBaseline = 'top';
					this.pinceau_com.fillText(this.etats_textes[etat][1], this.etats_X[etat], this.etats_Y[etat]+1);

				}
			}
			
		}
		
	}


	// Trace des fleches de l'algo

	this.pinceau_com.strokeStyle = 'black';
	this.pinceau_com.lineWidth = 2; 
			
	this.pinceau_com.beginPath();
				
	this.pinceau_com.moveTo(150, 25);
	this.pinceau_com.lineTo(150, 250);
			
	this.pinceau_com.lineTo(340, 250);
	this.pinceau_com.lineTo(340, 325);
	this.pinceau_com.lineTo(50, 325);
	this.pinceau_com.lineTo(50, 95);
	this.pinceau_com.lineTo(340, 95);

	this.pinceau_com.moveTo(150, 250);
	this.pinceau_com.lineTo(50, 250);
	this.pinceau_com.stroke();




	this.pinceau_com.strokeStyle = 'black';
	this.pinceau_com.lineWidth = 2; 
			
	this.pinceau_com.beginPath();
				
	this.pinceau_com.moveTo(150, 58);
	this.pinceau_com.lineTo(147, 55);
	this.pinceau_com.lineTo(153, 55);
	this.pinceau_com.closePath();
			
	this.pinceau_com.moveTo(78,95);
	this.pinceau_com.lineTo(75,92);
	this.pinceau_com.lineTo(75,98);
	this.pinceau_com.closePath();

	this.pinceau_com.moveTo(150, 158);
	this.pinceau_com.lineTo(147, 155);
	this.pinceau_com.lineTo(153, 155);
	this.pinceau_com.closePath();

	this.pinceau_com.moveTo(150, 213);
	this.pinceau_com.lineTo(147, 210);
	this.pinceau_com.lineTo(153, 210);
	this.pinceau_com.closePath();

	this.pinceau_com.moveTo(340, 303);
	this.pinceau_com.lineTo(337, 300);
	this.pinceau_com.lineTo(343, 300);
	this.pinceau_com.closePath();

	this.pinceau_com.moveTo(268, 250);
	this.pinceau_com.lineTo(265, 247);
	this.pinceau_com.lineTo(265, 253);
	this.pinceau_com.closePath();

	this.pinceau_com.moveTo(222, 325);
	this.pinceau_com.lineTo(225, 322);
	this.pinceau_com.lineTo(225, 328);
	this.pinceau_com.closePath();

	this.pinceau_com.moveTo(258, 95);
	this.pinceau_com.lineTo(255, 98);
	this.pinceau_com.lineTo(255, 92);
	this.pinceau_com.closePath();


	this.pinceau_com.stroke();
	this.pinceau_com.fill();

	this.pinceau_com.font = '10pt Calibri';
			
	//premier intersection
	this.pinceau_com.textAlign = 'left';
	this.pinceau_com.textBaseline = 'bottom';
	this.pinceau_com.fillText('OUI', 220, 93);

	this.pinceau_com.textAlign = 'left';
	this.pinceau_com.textBaseline = 'top';
	this.pinceau_com.fillText('NON', 152, 130);

	//deuxieme intersection
	this.pinceau_com.textAlign = 'right';
	this.pinceau_com.textBaseline = 'bottom';
	this.pinceau_com.fillText('OUI', 80, 248);

	this.pinceau_com.textAlign = 'left';
	this.pinceau_com.textBaseline = 'bottom';
	this.pinceau_com.fillText('NON', 220, 248);


}


var bordures_noeud = [["black",3],["black",3],["black",3]];
var fonds_noeud = ["white", "#ac00e6", "#4700b3"];
var couleurs_texte_noeud = ["black", "white", "white"];
var couleurs_arete = ["black", "blue", "green", "red", "lightgray"];
var epaisseurs_arete = [3, 6, 6, 6, 3];


var graphe = new Graphe("can_graphe", [5,5,490,390], bordures_noeud, fonds_noeud, couleurs_texte_noeud, couleurs_arete, epaisseurs_arete);


graphe.ajouterNoeud(50,150,30,"A");
graphe.ajouterNoeud(150,50,30,"B");
graphe.ajouterNoeud(300,50,30,"C");
graphe.ajouterNoeud(150,250,30,"D");
graphe.ajouterNoeud(300,250,30,"E");
graphe.ajouterNoeud(400,150,30,"F");


graphe.ajouterArrete(graphe.noeuds[0],graphe.noeuds[1],2);
graphe.ajouterArrete(graphe.noeuds[0],graphe.noeuds[3],5);
graphe.ajouterArrete(graphe.noeuds[1],graphe.noeuds[3],5);
graphe.ajouterArrete(graphe.noeuds[3],graphe.noeuds[4],7);
graphe.ajouterArrete(graphe.noeuds[3],graphe.noeuds[2],5);
graphe.ajouterArrete(graphe.noeuds[1],graphe.noeuds[2],6);
graphe.ajouterArrete(graphe.noeuds[2],graphe.noeuds[4],1);
graphe.ajouterArrete(graphe.noeuds[2],graphe.noeuds[5],3);
graphe.ajouterArrete(graphe.noeuds[4],graphe.noeuds[5],1);


graphe.tracer(false, 0, 0);



var algo = new Algorithme_Kruskal("can_liste_aretes", 1200, 60, "can_liste_groupes", "can_algo", 600,400, graphe);

algo.ETAT = 100;
algo.tracer_etats();
algo.ETAT = 0;

document.addEventListener('keydown', function (e){
	if(e.keyCode == 39){
		algo.suivant(true);
	}
	if(e.keyCode == 37){
		algo.precedant();
	}
});