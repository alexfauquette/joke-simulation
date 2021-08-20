function Algorithme_Prim(id_canvas1, limX, limY, id_canvas2, id_canvas_commentaire, limXC, limYC, graphe, debut){
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
	this.sub_etat = 0;
	this.nb_aretes_traitees = 0;
	this.aretes = [];
	this.groupes_sommets = [];

	this.debut = debut;

	this.tracer_liste_aretes = function(){
		this.pinceau_aretes.clearRect(0,0,this.limX,this.limY);
		this.pinceau_aretes.font = '15pt Calibri';
		this.pinceau_aretes.fillStyle = "black";
		this.pinceau_aretes.strokeStyle = "black";

		this.pinceau_aretes.textBaseline = "middle";
		this.pinceau_aretes.textAlign = 'center';


		this.pinceau_aretes.fillText("aretes : " , 40 , 35);
		this.pinceau_aretes.fillText("poids : ", 40 , 90);

		

		this.pinceau_aretes.lineWidth = 2;

		var N = this.aretes.length;

		this.x_aretes = 100;
		var x = this.x_aretes;
		this.dx_aretes = Math.min((this.limX - 2*x) / N , 40);

		
		for(var i = 0 ; i < N ; i++){
			this.pinceau_aretes.fillText(this.aretes[i][0], x , 15);
			this.pinceau_aretes.fillText(this.aretes[i][1], x , 60);
			this.pinceau_aretes.fillText(this.aretes[i][2], x , 90);

			this.pinceau_aretes.beginPath();
			this.pinceau_aretes.moveTo(x , 25);
			this.pinceau_aretes.lineTo(x , 45);
			this.pinceau_aretes.stroke();

			x = x + this.dx_aretes;
		}
	}

	this.tracer_liste_sommets = function(){
		this.pinceau_sommets.clearRect(0, 0, this.limX, 80);
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

		this.pinceau_aretes.fillText(this.aretes[indice][0], x , 15);
		this.pinceau_aretes.fillText(this.aretes[indice][1], x , 60);
		this.pinceau_aretes.fillText(this.aretes[indice][2], x , 90);

		this.pinceau_aretes.beginPath();
		this.pinceau_aretes.moveTo(x , 25);
		this.pinceau_aretes.lineTo(x , 45);
		this.pinceau_aretes.stroke();
		
	}

	this.initialisation = function(){

		graphe.initialisation();
		this.ETAT = 0;
		this.nb_aretes_traitees = 0;
		this.aretes = [];
		this.groupes_sommets = [];

		var N = this.graphe.aretes.length;

		// ---------------------  On met les aretes du graphe concernée par debut ------------------------------

		for(var i = 0 ; i < N ; i++){
			var n1 = this.graphe.aretes[i].noeud1.nom;
			var n2 = this.graphe.aretes[i].noeud2.nom;
			var p = this.graphe.aretes[i].nom;

			if(n1 == this.debut || n2 == this.debut){
				this.aretes.push([ n1 , n2 , p , i]);
				this.graphe.aretes[i].ETAT = 6;
				this.graphe.aretes[i].tracer(true,false);
			}
		}

		//-----------------------------------------------------------------------
		
		this.sommet_actuel = this.debut;	
		// -------------- On associe a chaque sommet une étiquette ---------------

		var N = this.graphe.sommets.length;

		for(var i = 0 ; i < N ; i ++){
			if(this.graphe.sommets[i] == this.debut){
				this.groupes_sommets.push(1);
				this.id_sommet_actuel = i;
			}
			else{
				this.groupes_sommets.push(0);
			}
		}

		//-------------------------------------------------------------------------

	}

	this.suivant = function(afficher){
		this.tracer_etats();
		if(this.ETAT == 0){
			this.initialisation();
			this.graphe.noeuds[this.id_sommet_actuel].ETAT = 1;
			if(afficher){
				this.tracer_liste_aretes();
				this.tracer_liste_sommets();
				this.graphe.noeuds[this.id_sommet_actuel].tracer();
				this.modifier_couleur_sommets(this.id_sommet_actuel,1,"#ac00e6")
			}
			this.ETAT = 1;
		}
		else if(this.ETAT == 1){
			if(this.aretes.length == 0 || this.nb_aretes_traitees == this.graphe.sommets.length-1){
				this.ETAT = 6;
			}
			else{
				this.ETAT = 2;
			}
		}

		else if(this.ETAT == 2){
			//recupere l'arete de ponderation minimale
			var N = this.aretes.length;
			this.id_mini = 0;
			var min = this.aretes[0][2];
			for(var i = 1 ; i < N ; i++){
				if(this.aretes[i][2] < min){
					min = this.aretes[i][2];
					this.id_mini = i;
				}
			}

			this.graphe.aretes[this.aretes[this.id_mini][3]].ETAT = 2;
			this.modifier_couleur_aretes(this.id_mini, "green");
			if(afficher){
				this.graphe.aretes[this.aretes[this.id_mini][3]].tracer(true,false);
			}
			this.ETAT = 3;
		}

		else if(this.ETAT == 3){
			//marquer le nouveau sommet comme vue

			this.graphe.aretes[this.aretes[this.id_mini][3]].ETAT = 1;
			if(afficher){
				this.graphe.aretes[this.aretes[this.id_mini][3]].tracer(true,false);
			}

			var N = this.graphe.sommets.length;
			var n1 = this.aretes[this.id_mini][0];
			var n2 = this.aretes[this.id_mini][1];

			for(var i = 0 ; i < N ; i++){
				if( (this.graphe.sommets[i] == n1 || this.graphe.sommets[i] == n2) && this.groupes_sommets[i] == 0){
					//le sommet i fait parti de l'arete mais n'est pas encore dans le sous arbre
					this.id_sommet_actuel = i;
					this.sommet_actuel = this.graphe.sommets[i];
				}
			}

			this.graphe.noeuds[this.id_sommet_actuel].ETAT = 1;
			this.groupes_sommets[this.id_sommet_actuel] = 1;
			if(afficher){
				this.graphe.noeuds[this.id_sommet_actuel].tracer();
				this.modifier_couleur_sommets(this.id_sommet_actuel,1,"#ac00e6");
				this.modifier_couleur_aretes(this.id_mini,"black");
			}

			this.ETAT = 4;
		}

		else if(this.ETAT == 4){
			if(this.sub_etat == 0){
				//partie repérage

				this.aretes_a_enlever = [];
				var N = this.aretes.length;

				for(var i = 0 ; i < N ; i++){
					if(this.aretes[i][0] == this.sommet_actuel || this.aretes[i][1] == this.sommet_actuel ){
						this.aretes_a_enlever.push(i);
						if(afficher){
							this.modifier_couleur_aretes(i, "red");
						}

						if(this.graphe.aretes[this.aretes[i][3]].ETAT == 6){
							this.graphe.aretes[this.aretes[i][3]].ETAT = 4;
							if(afficher){
								this.modifier_couleur_aretes(i, "red");
								this.graphe.aretes[this.aretes[i][3]].tracer(true,false);
							}
						}
					}
				}

				this.sub_etat = 1;
			}
			else if(this.sub_etat == 1){
				//partie suppression

				var N = this.aretes_a_enlever.length;
				for(var k = N-1 ; k >= 0 ; k--){
					var i = this.aretes_a_enlever[k];
					if(this.graphe.aretes[this.aretes[i][3]].ETAT == 4){
						this.graphe.aretes[this.aretes[i][3]].ETAT = 5;
						if(afficher){
							this.graphe.aretes[this.aretes[i][3]].tracer(true,false);
						}
					}

					this.aretes.splice(i,1);
				}

				if(afficher){
					this.tracer_liste_aretes();
				}
				this.sub_etat = 0;
				this.ETAT = 5;
			}
		}

		else if(this.ETAT == 5){
			if(this.sub_etat == 0){
				//Partie ou l'on affiche sur le graphe

				var N = this.graphe.aretes.length;
				for(var i = 0 ; i < N ; i++){
					if(this.graphe.aretes[i].noeud1.nom == this.sommet_actuel ){
						var j = this.graphe.sommets.indexOf(this.graphe.aretes[i].noeud2.nom);
						if(this.groupes_sommets[j] == 0){
							this.aretes.push([ this.graphe.aretes[i].noeud1.nom , this.graphe.aretes[i].noeud2.nom , this.graphe.aretes[i].nom , i]);
							this.graphe.aretes[i].ETAT = 3;
							if(afficher){
								this.graphe.aretes[i].tracer(true,false);
							}
						}
					}
					else if(this.graphe.aretes[i].noeud2.nom == this.sommet_actuel){
						var j = this.graphe.sommets.indexOf(this.graphe.aretes[i].noeud1.nom);
						if(this.groupes_sommets[j] == 0){
							this.aretes.push([ this.graphe.aretes[i].noeud1.nom , this.graphe.aretes[i].noeud2.nom , this.graphe.aretes[i].nom , i]);
							this.graphe.aretes[i].ETAT = 3;
							if(afficher){
								this.graphe.aretes[i].tracer(true,false);
							}
						}
					}
				}
				this.sub_etat = 1;
			}
			else if(this.sub_etat == 1){
				//Partie où l'on ajoute a la liste
				var N = this.graphe.aretes.length;
				for(var i = 0 ; i < N ; i++){
					if(this.graphe.aretes[i].ETAT == 3){
						this.graphe.aretes[i].ETAT = 6;
						if(afficher){
							this.graphe.aretes[i].tracer(true, false);
						}
					}
				}

				this.tracer_liste_aretes();
				this.sub_etat = 0;
				this.ETAT = 1;
				this.nb_aretes_traitees++;
			}
		}

	}

	this.precedant = function(){
		var nb = Math.max(this.nb_aretes_traitees-1, 0);

		this.initialisation();
		this.tracer_liste_sommets();


		while(this.nb_aretes_traitees < nb){
			this.suivant(false);
		}

		this.graphe.tracer(false, 0, 0);
		this.tracer_etats();

		this.tracer_liste_aretes();

		var N = this.graphe.sommets.length;
		for(var i = 0 ; i < N ; i++){
			if(this.graphe.noeuds[i].ETAT == 1){
				this.modifier_couleur_sommets(i, 1, "#ac00e6");
			}
		}

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

	this.etats_X = [150, 150, 150, 150, 150, 150, 330];
	this.etats_Y = [25, 95, 180, 235, 290, 345, 95];
	this.etats_W = [140, 140, 140, 140, 140, 140, 140];
	this.etats_H = [40, 70, 40, 40, 40, 40, 40];
	this.etats_formes = ['r','l','r','r','r','r','r'];
	this.etats_textes = [['Initialisation'],['n-1 arêtes','conservées ?'],['prendre une arête','de poid minimal'],['ajouter le nouveau',"sommet à l'arbre"],["supprimer les arêtes","devenues innutiles"],['Ajouter les nouvelles','arêtes'],['FIN']];
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
	this.pinceau_com.lineTo(150, 345);
			
	this.pinceau_com.lineTo(50, 345);
	this.pinceau_com.lineTo(50, 95);
	this.pinceau_com.lineTo(340, 95);
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

	this.pinceau_com.moveTo(150, 268);
	this.pinceau_com.lineTo(147, 265);
	this.pinceau_com.lineTo(153, 265);
	this.pinceau_com.closePath();

	this.pinceau_com.moveTo(150, 323);
	this.pinceau_com.lineTo(147, 320);
	this.pinceau_com.lineTo(153, 320);
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
}


var bordures_noeud = [["black",3],["black",3],["black",3]];
var fonds_noeud = ["white", "#ac00e6", "#4700b3"];
var couleurs_texte_noeud = ["black", "white", "white"];
var couleurs_arete = ["black", "blue", "green", "orange", "red", "lightgray", "#4700b3"];
var epaisseurs_arete = [6, 6, 6, 6, 6, 7, 6];


var graphe2 = new Graphe("can_graphe2", [5,5,490,390], bordures_noeud, fonds_noeud, couleurs_texte_noeud, couleurs_arete, epaisseurs_arete);


graphe2.ajouterNoeud(50,150,30,"A");
graphe2.ajouterNoeud(150,50,30,"B");
graphe2.ajouterNoeud(300,50,30,"C");
graphe2.ajouterNoeud(150,250,30,"D");
graphe2.ajouterNoeud(300,250,30,"E");
graphe2.ajouterNoeud(400,150,30,"F");


graphe2.ajouterArrete(graphe2.noeuds[0],graphe2.noeuds[1],2);
graphe2.ajouterArrete(graphe2.noeuds[0],graphe2.noeuds[3],5);
graphe2.ajouterArrete(graphe2.noeuds[1],graphe2.noeuds[3],5);
graphe2.ajouterArrete(graphe2.noeuds[3],graphe2.noeuds[4],7);
graphe2.ajouterArrete(graphe2.noeuds[3],graphe2.noeuds[2],5);
graphe2.ajouterArrete(graphe2.noeuds[1],graphe2.noeuds[2],6);
graphe2.ajouterArrete(graphe2.noeuds[2],graphe2.noeuds[4],1);
graphe2.ajouterArrete(graphe2.noeuds[2],graphe2.noeuds[5],3);
graphe2.ajouterArrete(graphe2.noeuds[4],graphe2.noeuds[5],1);


graphe2.tracer(false, 0, 0);



var algo2 = new Algorithme_Prim("can_liste_aretes2", 1200, 110, "can_liste_groupes2", "can_algo2", 600,400, graphe2,"E");

algo2.ETAT = 100;
algo2.tracer_etats();
algo2.ETAT = 0;

document.addEventListener('keydown', function (e){
	if(e.keyCode == 39){
		algo2.suivant(true);
	}
	if(e.keyCode == 37){
		algo2.precedant();
	}
});