function Algorithme_Dijkstra(tableau, frontiere, graphe, debut, fin, id_canvas_commentaire, limXC, limYC){
	this.pinceau_com = document.getElementById(id_canvas_commentaire).getContext("2d");

	this.limXC = limXC;
	this.limYC = limYC;
	
	//elements manipulés par l'algorithmes
	this.tableau = tableau;
	this.frontiere = frontiere;
	this.graphe = graphe;

	//variable d'etat du systeme
	this.ETAT = 0;
	this.sommet_actuel;
	this.voisin_actuel;
	this.voisins = [];
	this.ETATS_invisibles = [4, 6, 7, 8];
	this.nb_boucles = 0;

	//variables pour l'initialisation
	this.debut = debut;
	this.fin = fin;

	//le trie de la fontiere se faira en fonction du deuxieme element (c'est a dire la distance)
	this.frontiere.comparer = function(A,B){
		return A[1]>B[1];
	}
	//frontiere comprend 3 elements par sommet : [ nom , distance , id]


	this.grossir_chemin = function(objectif, afficher){
		var id2 = this.graphe.get_id_Sommet(objectif);
		var s2 = objectif;
		var s1 = this.tableau.tableau[id2][1];
		var id1 = this.graphe.get_id_Sommet(s1);

		var N = this.graphe.aretes.length;
		while(id1 >= 0){//tant qu'il y a bien un antecedant

			for(var k = 0 ; k < N ; k++){
				if(this.graphe.aretes[k].noeud1.nom == s1  &&  this.graphe.aretes[k].noeud2.nom == s2){
					if(this.graphe.aretes[k].ETAT == 1){
						this.graphe.aretes[k].ETAT = 2;
					}
					else if(this.graphe.aretes[k].ETAT == 0){
						this.graphe.aretes[k].ETAT = 3;
					}

					if(afficher){
						this.graphe.aretes[k].tracer(this.graphe.pondere , this.graphe.oriente);
					}
					
				}
			}

			id2 = id1;
			s2 = s1;
			s1 = this.tableau.tableau[id2][1];
			id1 = this.graphe.get_id_Sommet(s1);
		}
	}

	this.suivant = function(afficher, animation){


		if(this.ETAT == 0){

			this.tableau.modifier(this.debut , 2 , 0, afficher);
			this.frontiere.ajouter([this.graphe.sommets[this.debut] , 0, this.debut], animation,afficher);
			this.graphe.noeuds[this.debut].ETAT = 2;
			if(afficher){
				this.graphe.noeuds[this.debut].tracer();
				this.commentaire();
			}

			this.ETAT = 1;
		}

		else if(this.ETAT == 1){
			this.nb_boucles++;

			if(afficher){
				this.commentaire();
			}


			if(this.frontiere.liste.length == 0){
				this.ETAT = 14;
				this.indice = 0;
			}
			else{
				this.ETAT = 2;
			}
		}

		else if(this.ETAT == 2){
			this.sommet_actuel = this.frontiere.recuperer(animation,afficher)[2];
			
			this.graphe.noeuds[this.sommet_actuel].ETAT = 6;
			if(afficher){
				this.graphe.noeuds[this.sommet_actuel].tracer();
				this.commentaire();
			}

			this.ETAT = 3;
		}

		else if(this.ETAT == 3){
			var v = this.graphe.get_voisins(this.sommet_actuel);
			var n = v.length;

			for(var i = 0 ; i < n ; i++){
				this.voisins.push(v[i]);
				if(this.graphe.noeuds[v[i]].ETAT == 2){
					this.graphe.noeuds[v[i]].ETAT = 3;
				}
				else if(this.graphe.noeuds[v[i]].ETAT == 0){
					this.graphe.noeuds[v[i]].ETAT = 1;
				}
				else if(this.graphe.noeuds[v[i]].ETAT == 5){
					this.graphe.noeuds[v[i]].ETAT = 7;
				}
				
				if(afficher){
					this.commentaire();
					this.graphe.noeuds[v[i]].tracer();
				}

				
			}

			this.voisin_actuel = -1;
			this.ETAT = 4;
		}

		else if(this.ETAT == 4){

			this.graphe.tracer(false, 0, 0);

			if(afficher && this.voisin_actuel >= 0){
				this.tableau.peindre(this.voisin_actuel, "white", "black");
			}

			if(this.voisins.length == 0){
				if(afficher){
					this.tableau.peindre(this.sommet_actuel, "white", "black");
				}

				this.ETAT = 1;
				this.graphe.noeuds[this.sommet_actuel].ETAT = 5;
				if(afficher){
					this.graphe.noeuds[this.sommet_actuel].tracer();
				}
			}
			else{
				this.ETAT = 5;
			}
			
		}

		else if(this.ETAT == 5){
			this.voisin_actuel = this.voisins.pop();

			if(this.graphe.noeuds[this.voisin_actuel].ETAT == 1){
				this.graphe.noeuds[this.voisin_actuel].ETAT = 9;
			}
			else if(this.graphe.noeuds[this.voisin_actuel].ETAT == 3){
				this.graphe.noeuds[this.voisin_actuel].ETAT = 4;
			}
			else if(this.graphe.noeuds[this.voisin_actuel].ETAT == 7){
				this.graphe.noeuds[this.voisin_actuel].ETAT = 8;
			}
			
			if(afficher){
				this.commentaire();
				this.graphe.noeuds[this.voisin_actuel].tracer();
			}

			this.ETAT = 6;
		}

		else if(this.ETAT == 6){
			if(this.graphe.noeuds[this.voisin_actuel].ETAT == 8){
				
				this.graphe.noeuds[this.voisin_actuel].ETAT = 5;
				if(afficher){
					this.graphe.noeuds[this.voisin_actuel].tracer();
				}

				this.ETAT = 4;
			}
			else{
				this.ETAT = 7;
			}
			
		}

		else if(this.ETAT == 7){
			this.commentaire();
			if(this.graphe.noeuds[this.voisin_actuel].ETAT == 4){
				this.ETAT = 9;
			}
			else{
				this.ETAT = 10;
			}
		}

		else if(this.ETAT == 9){
			this.d1 = this.tableau.tableau[this.sommet_actuel][2] + this.graphe.matrice[this.sommet_actuel][this.voisin_actuel];
			
			if(afficher){
				this.commentaire();
			}

			this.ETAT = 11;

			//trace du chemin donnant d'
			this.grossir_chemin(this.graphe.sommets[this.sommet_actuel] , afficher);

			var n = this.graphe.aretes.length;
			var s1 = this.graphe.sommets[this.sommet_actuel];
			var s2 = this.graphe.sommets[this.voisin_actuel];
			for(var k = 0 ; k < n ; k++){
				if(this.graphe.aretes[k].noeud1.nom == s1  &&  this.graphe.aretes[k].noeud2.nom == s2){
					this.graphe.aretes[k].ETAT = 3;
					if(afficher){
						this.graphe.aretes[k].tracer(this.graphe.pondere , this.graphe.oriente);
					}
				}
			}

			//tracé du chemin donnant distance()
			this.grossir_chemin(this.tableau.tableau[this.voisin_actuel][1] , afficher);//chemin partant de l'antecedant du voisin en court de traitement

			var n = this.graphe.aretes.length;
			var s1 = this.tableau.tableau[this.voisin_actuel][1];
			var s2 = this.graphe.sommets[this.voisin_actuel];
			for(var k = 0 ; k < n ; k++){
				if(this.graphe.aretes[k].noeud1.nom == s1  &&  this.graphe.aretes[k].noeud2.nom == s2){
					this.graphe.aretes[k].ETAT = 3;
					if(afficher){
						this.graphe.aretes[k].tracer(this.graphe.pondere , this.graphe.oriente);
					}
				}
			}


		}

		else if(this.ETAT == 10){
			this.d1 = this.tableau.tableau[this.sommet_actuel][2] + this.graphe.matrice[this.sommet_actuel][this.voisin_actuel];
			
			if(afficher){
				this.commentaire();
			}

			this.ETAT = 12;

			//tracé du chemin donnant d'
			this.grossir_chemin(this.graphe.sommets[this.sommet_actuel] , afficher);

			var n = this.graphe.aretes.length;
			var s1 = this.graphe.sommets[this.sommet_actuel];
			var s2 = this.graphe.sommets[this.voisin_actuel];
			for(var k = 0 ; k < n ; k++){
				if(this.graphe.aretes[k].noeud1.nom == s1  &&  this.graphe.aretes[k].noeud2.nom == s2){
					this.graphe.aretes[k].ETAT = 3;
					if(afficher){
						this.graphe.aretes[k].tracer(this.graphe.pondere , this.graphe.oriente);
					}
				}
			}
		}

		else if(this.ETAT == 11){

			var n = this.graphe.aretes.length;
			var s1 = this.tableau.tableau[this.voisin_actuel][1];
			var s2 = this.graphe.sommets[this.voisin_actuel];
			for(var k = 0 ; k < n ; k++){
				if(this.graphe.aretes[k].noeud1.nom == s1  &&  this.graphe.aretes[k].noeud2.nom == s2){
					this.graphe.aretes[k].ETAT = 3;
					if(afficher){
						this.graphe.aretes[k].tracer(this.graphe.pondere , this.graphe.oriente);
					}
				}
			}


			if(this.d1 >= this.tableau.tableau[this.voisin_actuel][2]){
				this.graphe.noeuds[this.voisin_actuel].ETAT = 2;
				if(afficher){
					this.graphe.noeuds[this.voisin_actuel].tracer();
					this.commentaire();
				}

				this.ETAT = 4;

				//mettre en vert la bonne arete
				var n = this.graphe.aretes.length;
				var s1 = this.tableau.tableau[this.voisin_actuel][1];
				var s2 = this.graphe.sommets[this.voisin_actuel];
				for(var k = 0 ; k < n ; k++){
					if(this.graphe.aretes[k].noeud1.nom == s1  &&  this.graphe.aretes[k].noeud2.nom == s2){
						this.graphe.aretes[k].ETAT = 6;
						if(afficher){
							this.graphe.aretes[k].tracer(this.graphe.pondere , this.graphe.oriente);
						}
						this.graphe.aretes[k].ETAT = 1;
					}
					else if(this.graphe.aretes[k].ETAT == 2){
						this.graphe.aretes[k].ETAT = 1;
					}
					else if(this.graphe.aretes[k].ETAT == 3){
						this.graphe.aretes[k].ETAT = 0;
					}
				}

			}
			else{
				this.ETAT = 12;

				//mettre en vert la bonne arete
				var n = this.graphe.aretes.length;
				var s1 = this.graphe.sommets[this.sommet_actuel];
				var s2 = this.graphe.sommets[this.voisin_actuel];
				for(var k = 0 ; k < n ; k++){
					if(this.graphe.aretes[k].noeud1.nom == s1  &&  this.graphe.aretes[k].noeud2.nom == s2){
						this.graphe.aretes[k].ETAT = 6;
						if(afficher){
							this.graphe.aretes[k].tracer(this.graphe.pondere , this.graphe.oriente);
						}
						this.graphe.aretes[k].ETAT = 1;
					}
					else if(this.graphe.aretes[k].ETAT == 2){
						this.graphe.aretes[k].ETAT = 1;
					}
					else if(this.graphe.aretes[k].ETAT == 3){
						this.graphe.aretes[k].ETAT = 0;
					}
				}

			}
		}

		else if(this.ETAT == 12){
			this.tableau.modifier(this.voisin_actuel, 2, this.d1, afficher);
			this.tableau.modifier(this.voisin_actuel, 1, this.graphe.sommets[this.sommet_actuel], afficher);
			this.tableau.peindre(this.voisin_actuel, "orange", "white");

			if(afficher){
				this.commentaire();
			}
			
			this.ETAT = 13;

			//mettre en vert la bonne arete
			var n = this.graphe.aretes.length;
			var s1 = this.graphe.sommets[this.sommet_actuel];
			var s2 = this.graphe.sommets[this.voisin_actuel];
			for(var k = 0 ; k < n ; k++){
				if(this.graphe.aretes[k].noeud1.nom == s1  &&  this.graphe.aretes[k].noeud2.nom == s2){
					this.graphe.aretes[k].ETAT = 6;
					if(afficher){
						this.graphe.aretes[k].tracer(this.graphe.pondere , this.graphe.oriente);
					}
					this.graphe.aretes[k].ETAT = 1;
				}
				else if(this.graphe.aretes[k].ETAT == 2){
					this.graphe.aretes[k].ETAT = 1;
				}
				else if(this.graphe.aretes[k].ETAT == 3){
					this.graphe.aretes[k].ETAT = 0;
				}
			}
		}

		else if(this.ETAT == 13){
			if(afficher){
				this.commentaire();
			}

			if(this.graphe.noeuds[this.voisin_actuel].ETAT == 4){//Si on a juste potentiellement change une des distance

				//On s'assure que la frontiere contient les bonnes distances pour chaque sommet
				var n = this.frontiere.liste.length;
				for(var i = 0 ; i < n ; i++){
					this.frontiere.liste[i][1] = this.tableau.tableau[this.frontiere.liste[i][2]][2];
				}

				this.frontiere.trier(animation,afficher);
			}


			else if(this.graphe.noeuds[this.voisin_actuel].ETAT == 9){//Si il faut ajouter le sommet
				
				//reprise de la fonction de tri
				if(afficher && animation){
					this.frontiere.animationEnCours = false;

					var coordonnees_fin = this.frontiere.get_coordonnes();
					var N = this.frontiere.liste.length;
					
					this.frontiere.liste.push([this.graphe.sommets[this.voisin_actuel] , this.tableau.tableau[this.voisin_actuel][2], this.voisin_actuel]);//On ajoute manuellement l'element

					var modifications = this.frontiere.trier_liste();
		
					var coordonnees_debut = [];
					for(var i = 0 ; i < N+1 ; i++){
						if(modifications[i] == N){
							coordonnees_debut[i] = [this.frontiere.x0 , this.frontiere.y0];
						}
						else{
							coordonnees_debut[i] = coordonnees_fin[modifications[i]];
						}
					}

					//On recalcule les coordonnées de fin, car il y a un element en plus
					var coordonnees_fin = this.frontiere.get_coordonnes();

					var obj = this.frontiere;
					setTimeout(function(){
						obj.animationEnCours = true;
						obj.animation_trier(20, coordonnees_debut, coordonnees_fin);}
						,60);

				}

				else{
					this.frontiere.liste.push([this.graphe.sommets[this.voisin_actuel] , this.tableau.tableau[this.voisin_actuel][2], this.voisin_actuel]);//On ajoute manuellement l'element

					this.frontiere.trier_liste();
					if(afficher){
						this.frontiere.tracer();
					}
				}
			}

			this.graphe.noeuds[this.voisin_actuel].ETAT = 2;
			if(afficher){
				this.graphe.noeuds[this.voisin_actuel].tracer();
			}

			this.ETAT = 4;
		}

		else if(this.ETAT == 14){
			if(this.indice>0){
				this.tableau.peindre(this.indice-1, "white", "black");
			}

			
			if(this.indice < this.graphe.sommets.length){
				this.tableau.peindre(this.indice, "green", "white");
				this.ETAT = 15;
			}
			else{
				this.ETAT = 16;
			}
		}

		else if(this.ETAT == 15){
			

			var sommet_2 = this.tableau.tableau[this.indice][0];
			var sommet_1 = this.tableau.tableau[this.indice][1];

			var i1 = this.graphe.sommets.indexOf(sommet_1);
			var i2 = this.graphe.sommets.indexOf(sommet_2);

			if(i1 >=0 && i2 >=0){
				var N = this.graphe.aretes.length;
				for(var k = 0 ; k < N ; k++){
					var j1 = this.graphe.noeuds.indexOf(this.graphe.aretes[k].noeud1);
					var j2 = this.graphe.noeuds.indexOf(this.graphe.aretes[k].noeud2);
					if(j1 == i1 && j2 == i2){
						this.graphe.aretes[k].ETAT = 4;
						this.graphe.aretes[k].tracer(true,this.graphe.oriente);
					}
				}
			}

			this.indice = this.indice + 1;
			this.ETAT = 14;
		}

		else if(this.ETAT == 16){
			this.tableau.peindre(this.indice-1, "white", "black");
			var N = this.graphe.aretes.length;
			for(var k = 0 ; k < N ; k++){
				if(this.graphe.aretes[k].ETAT == 0){
					this.graphe.aretes[k].ETAT = 5;
					this.graphe.aretes[k].tracer(true,this.graphe.oriente);
				}
			}
		}

	}





	this.commentaire = function(){
		this.pinceau_com.font = '20pt Calibri';

		this.pinceau_com.textBaseline = "bottom";
		this.pinceau_com.textAlign = 'center';

		this.pinceau_com.fillStyle = "black";
		
		if(this.ETAT == 0){
			this.pinceau_com.clearRect( 0 , 0 , this.limXC , this.limYC );
			
			this.pinceau_com.fillText("On associe la distance 0 au sommet de départ : ", this.limXC/2 ,100);
			var x = (this.pinceau_com.measureText("On associe la distance 0 au sommet de départ  :").width+this.limXC)/2;

			this.pinceau_com.textAlign = 'left';
			this.pinceau_com.fillStyle = "orange";
			this.pinceau_com.fillText(this.graphe.sommets[this.debut] ,x,100);

			this.tableau.peindre(this.debut, "orange", "white");
			this.pinceau_com.textBaseline = "top";
			this.pinceau_com.textAlign = 'center';
			this.pinceau_com.fillStyle = "black";
			this.pinceau_com.fillText("Et on met ce sommet dans la frontière",this.limXC/2, 100);


		}

		else if(this.ETAT == 1){
			this.pinceau_com.clearRect( 0 , 0 , this.limXC , this.limYC );

			if(this.frontiere.liste.length > 0){
				this.pinceau_com.fillText("Comme la frontière n'est pas vide,", this.limXC/2 ,100);

				this.pinceau_com.fillText("on y prend le sommet de distance minimale", this.limXC/2 ,140);

				this.pinceau_com.fillText("ici, ce sommet est : ", this.limXC/2 ,180);
				var x = (this.pinceau_com.measureText("ici, ce sommet est : ").width+this.limXC)/2;

				this.pinceau_com.textAlign = 'left';
				this.pinceau_com.fillStyle = "red";
				this.pinceau_com.fillText(this.frontiere.liste[0][0] ,x,180);
			}
		}

		else if(this.ETAT == 2){
			this.tableau.peindre(this.sommet_actuel , "red", "white");
		}

		else if(this.ETAT == 3){
			this.pinceau_com.clearRect( 0 , 0 , this.limXC , this.limYC );

			this.pinceau_com.fillText("On recupére les voisins de ce sommet :", this.limXC/2 ,50);
			var txt  = "voisins("+ this.graphe.sommets[this.sommet_actuel] + ") = [";
			var n = this.voisins.length;
			for(var i = n-1 ; i >= 0 ; i--){
				txt = txt + this.graphe.sommets[this.voisins[i]];
				if(i>0){txt = txt + ", ";}
			}
			txt = txt + "]";

			this.pinceau_com.fillText(txt, this.limXC/2 ,85);

			this.tableau.peindre(this.sommet_actuel, "white", "black");
		}

		else if(this.ETAT == 5){
			this.pinceau_com.clearRect( 0 , 100 , this.limXC , this.limYC-100 );

			this.pinceau_com.textBaseline = "top";
			this.pinceau_com.textAlign = 'left';

			this.pinceau_com.fillText("On va traiter le sommet ", 10 ,100);
			var x = this.pinceau_com.measureText("On va traiter le sommet ").width+10;

			this.pinceau_com.fillStyle = "orange";
			this.pinceau_com.fillText(this.graphe.sommets[this.voisin_actuel] ,x,100);

			var x = x + this.pinceau_com.measureText(this.graphe.sommets[this.voisin_actuel]).width;

			this.pinceau_com.fillStyle = "black";
			this.pinceau_com.fillText(" : " , x, 100);


			if(this.graphe.noeuds[this.voisin_actuel].ETAT == 8){
				this.pinceau_com.textAlign = 'center';
				this.pinceau_com.fillStyle = "black";
				this.pinceau_com.fillText("Comme ce sommet a déjà été traité, il n'y a rien à faire", this.limXC/2 ,200);
			}
		}

		else if(this.ETAT == 7){
			this.pinceau_com.textBaseline = "top";

			this.pinceau_com.textAlign = 'left';

			if(this.tableau.tableau[this.voisin_actuel][2] != "inf"){
				var l1 = this.pinceau_com.measureText("Actuellement, le plus court chemin connue vers ").width;
				var l2 = this.pinceau_com.measureText(this.graphe.sommets[this.voisin_actuel]).width;
				var l3 = this.pinceau_com.measureText(" vaut : ").width;

				var x = (this.limXC-l1-l2-l3)/2;

				this.pinceau_com.fillText("Actuellement, le plus court chemin connue vers ", x ,145);
				x = x + l1;

				this.pinceau_com.fillStyle = "orange";
				this.pinceau_com.fillText(this.graphe.sommets[this.voisin_actuel] , x , 145);

				x = x + l2;

				this.pinceau_com.fillStyle = "black";
				this.pinceau_com.fillText(" vaut : " , x , 145);
				x = x + l3;

				this.pinceau_com.fillStyle = "orange";
				this.pinceau_com.fillText(this.tableau.tableau[this.voisin_actuel][2] , x , 145);

				//écriture du chemin trouvé pour le moment
				var s = this.tableau.tableau[this.voisin_actuel][1];
				id = this.graphe.get_id_Sommet(s);
				var sommets = [this.tableau.tableau[this.voisin_actuel][0] ];

				while(id >= 0){
					sommets.push(s);
					s = this.tableau.tableau[id][1];
					id = this.graphe.get_id_Sommet(s);
				}

				var text = "";
				var n = sommets.length;
				for(var i = n-1 ; i>=0 ; i--){
					text  = text + sommets[i];
					if(i!=0){
						text = text + " -> ";
					}
				}

				this.pinceau_com.fillStyle = "black";
				this.pinceau_com.textAlign = "center";
				this.pinceau_com.fillText(text, this.limXC/2 , 180);



			}

			else{

				var l1 = this.pinceau_com.measureText("Actuellement, le plus court chemin connue vers ").width;
				var l2 = this.pinceau_com.measureText(this.graphe.sommets[this.voisin_actuel]).width;
				var l3 = this.pinceau_com.measureText(" vaut ").width;
				var l4 = this.pinceau_com.measureText("l'infini").width;
				var x = (this.limXC-l1-l2-l3-l4)/2;
				
				this.pinceau_com.fillText("Actuellement, le plus court chemin connue vers ", x ,145);
				x = x + l1;

				this.pinceau_com.fillStyle = "orange";
				this.pinceau_com.fillText(this.graphe.sommets[this.voisin_actuel] , x , 145);

				x = x + l2;

				this.pinceau_com.fillStyle = "black";
				this.pinceau_com.fillText(" vaut " , x , 145);
				x = x + l3;

				this.pinceau_com.fillStyle = "orange";
				this.pinceau_com.fillText(" l'infini" , x , 145);

				this.pinceau_com.fillStyle = "black";
				this.pinceau_com.textAlign = "center";
				this.pinceau_com.fillText("(pas de chemin trouvé pour l'instant)", this.limXC/2 , 180);

			}			
		}

		else if(this.ETAT == 9 || this.ETAT == 10){
			var l1 = this.pinceau_com.measureText("On peut aussi aller jusque ").width;
			var l2 = this.pinceau_com.measureText(this.graphe.sommets[this.sommet_actuel]).width;
			var l3 = this.pinceau_com.measureText(" puis aller vers ").width;
			var l4 = this.pinceau_com.measureText(this.graphe.sommets[this.voisin_actuel]).width;
			var x = (this.limXC-l1-l2-l3-l4)/2;
			this.pinceau_com.textAlign = "left";

			this.pinceau_com.fillText("On peut aussi aller jusque ", x ,270);
			x = x + l1;

			this.pinceau_com.fillStyle = "red";
			this.pinceau_com.fillText(this.graphe.sommets[this.sommet_actuel] , x , 270);

			x = x + l2;

			this.pinceau_com.fillStyle = "black";
			this.pinceau_com.fillText(" puis aller vers " , x , 270);
			x = x + l3;

			this.pinceau_com.fillStyle = "orange";
			this.pinceau_com.fillText(this.graphe.sommets[this.voisin_actuel], x , 270);


			////////////////////////////////////////////////

			//écriture du chemin trouvé pour le moment
			var s = this.tableau.tableau[this.sommet_actuel][0];
			id = this.sommet_actuel;
			var sommets = [this.tableau.tableau[this.voisin_actuel][0] ];

			while(id >= 0){
				sommets.push(s);
				s = this.tableau.tableau[id][1];
				id = this.graphe.get_id_Sommet(s);
			}

			var text = "";
			var n = sommets.length;
			for(var i = n-1 ; i>=0 ; i--){
				text  = text + sommets[i];
				if(i!=0){
					text = text + " -> ";
				}
			}
			text = text + "    (Ce qui vaut : "

			var l1 = this.pinceau_com.measureText(text).width;
			var l2 = this.pinceau_com.measureText(this.tableau.tableau[this.sommet_actuel][2]).width;
			var l3 = this.pinceau_com.measureText(" + ").width;
			var l4 = this.pinceau_com.measureText(this.graphe.matrice[this.sommet_actuel][this.voisin_actuel]).width;
			var l5 = this.pinceau_com.measureText(" = ").width;
			var l6 = this.pinceau_com.measureText(this.d1).width

			var x = (this.limXC - l1 - l2 - l3 - l4 - l5 - l6) / 2;

			this.pinceau_com.fillStyle = "black";
			this.pinceau_com.fillText(text , x , 295);

			var x = x + l1;

			this.pinceau_com.fillStyle = "blue";
			this.pinceau_com.fillText(this.tableau.tableau[this.sommet_actuel][2] , x , 295);
			
			var x = x + l2;

			this.pinceau_com.fillStyle = "black";
			this.pinceau_com.fillText(" + " , x , 295);

			var x = x + l3;

			this.pinceau_com.fillStyle = "orange";
			this.pinceau_com.fillText(this.graphe.matrice[this.sommet_actuel][this.voisin_actuel] , x , 295);

			var x = x + l4;

			this.pinceau_com.fillStyle = "black";
			this.pinceau_com.fillText(" = " , x , 295);

			var x = x + l5;

			this.pinceau_com.fillStyle = "red";
			this.pinceau_com.fillText(this.d1 , x , 295);

			var x = x + l6;

			this.pinceau_com.fillStyle = "black";
			this.pinceau_com.fillText(" )" , x , 295);



		}

		else if(this.ETAT == 11){
			this.pinceau_com.fillText("Ce nouveau chemin est moins interessant que le précédant", this.limXC/2 ,360);
			this.pinceau_com.fillText("On ne va donc rien changer dans la tableau", this.limXC/2 ,385);
		}

		else if(this.ETAT == 12){
			this.pinceau_com.fillText("Ce nouveau chemin est plus interessant que le précédant", this.limXC/2 ,360);
			this.pinceau_com.fillText("On modifie donc la distance et l'antécédant de ", this.limXC/2 ,385);

			this.pinceau_com.fillStyle = "orange";
			this.pinceau_com.textAlign = "left";
			var x = (this.limXC + this.pinceau_com.measureText("On modifie donc la distance et l'antécédant de ").width ) / 2;
			this.pinceau_com.fillText(this.graphe.sommets[this.voisin_actuel] , x , 385);
		}

		else if(this.ETAT == 13){
			if(this.graphe.noeuds[this.voisin_actuel].ETAT == 4){//Si on a juste potentiellement change une des distance
				this.pinceau_com.fillText("On vérifie que la frontière est toujours triée après cette modification", this.limXC/2 ,440);
			}


			else if(this.graphe.noeuds[this.voisin_actuel].ETAT == 9){
				this.pinceau_com.fillText("On l'ajoute à la frontière (à la bonne place)", this.limXC/2 ,440);
			}
			
		}

	}










	this.suivant2 = function(afficher, animation){
		//ne s'arrete pas si il n'y a rien de visuel
		/*if(this.ETAT == 0){
			this.uisvant(afficher, animation);
			this.suivant(afficher, animation);
		}*/
		//else{
			while(this.ETATS_invisibles.indexOf(this.ETAT) >=0){
				this.suivant(afficher, animation);
			}
			this.suivant(afficher, animation);
			
		//}
	}

	this.initialisation = function(){
		this.ETAT = 0;
		this.nb_boucles = 0;
		var n = this.graphe.noeuds.length;
		for(var i = 0 ; i < n ; i++){
			this.graphe.noeuds[i].ETAT = 0;
		}

		var n = this.graphe.aretes.length;
		for(var i = 0 ; i < n ; i++){
			this.graphe.aretes[i].ETAT = 0;
		}
	}


	this.precedant = function(){
		if(this.ETAT > 0){
			var etat = this.ETAT;


			/*

			Repenser la facon de se retrouver dans l'etat précédent
			Et surtout : c'est quoi l'etat precedant ?
			
			*/
			var n = this.nb_boucles;
			this.initialisation();
			this.tableau.initialisation();
			this.frontiere.liste = [];
			this.suivant(false,false);
			while(this.nb_boucles < n-1){
				this.suivant(false,false);
			}
			this.graphe.tracer(false, 0, 0);
			this.frontiere.tracer();
			this.tableau.tracer();
		}
	}

}

var bordures_noeud = [["black",5],["pink",5],["black",5],["pink",5],["red",5],["black",5],["black",5],["black",5],["red",5],["red",5]];
var fonds_noeud = ["white", "white", "orange", "orange", "orange", "green", "red","green","green","white"];
var couleurs_texte_noeud = ["black", "black", "white", "white", "white", "white", "white","white","white", "black"];
var couleurs_arete = ["black", "blue", "blue", "orange", "green","lightgray", "green"];
var epaisseurs_arete = [2, 2, 6, 6, 6, 2, 6];


var graphe = new Graphe("can_graphe", [5,5,490,390], bordures_noeud, fonds_noeud, couleurs_texte_noeud, couleurs_arete, epaisseurs_arete);

graphe.oriente = true;

graphe.ajouterNoeud(50,150,30,"A");
graphe.ajouterNoeud(150,50,30,"B");
graphe.ajouterNoeud(300,50,30,"C");
graphe.ajouterNoeud(150,250,30,"D");
graphe.ajouterNoeud(300,250,30,"E");
graphe.ajouterNoeud(400,150,30,"F");


graphe.ajouterArrete(this.graphe.noeuds[0],this.graphe.noeuds[1],6);
graphe.ajouterArrete(this.graphe.noeuds[0],this.graphe.noeuds[3],1);
graphe.ajouterArrete(this.graphe.noeuds[1],this.graphe.noeuds[3],5);
graphe.ajouterArrete(this.graphe.noeuds[3],this.graphe.noeuds[1],1);
graphe.ajouterArrete(this.graphe.noeuds[3],this.graphe.noeuds[4],4);
graphe.ajouterArrete(this.graphe.noeuds[3],this.graphe.noeuds[2],2);
graphe.ajouterArrete(this.graphe.noeuds[1],this.graphe.noeuds[2],3);
graphe.ajouterArrete(this.graphe.noeuds[2],this.graphe.noeuds[4],1);
graphe.ajouterArrete(this.graphe.noeuds[2],this.graphe.noeuds[5],3);
graphe.ajouterArrete(this.graphe.noeuds[4],this.graphe.noeuds[5],1);


graphe.tracer(false, 0, 0);

var tableau = new Tableau_Dijkstra("can_tableau", 5, 5, 290, 390, graphe);

tableau.initialisation();


var frontiere = new Liste_animee([], 5, 5, 490, 50, "horizontal", 30, 50, "orange", "white", "can_liste");
frontiere.tracer();


var algo = new Algorithme_Dijkstra(tableau, frontiere, graphe, 0,3 , "can_algo" , 800 , 500);


document.addEventListener('keydown', function (e){
	if(e.keyCode == 39){
		algo.suivant2(true,true);
	}
	if(e.keyCode == 37){
		algo.precedant();
	}
});