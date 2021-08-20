function Algorithme_parcourt(id_canvas, couleursNormal, couleursActuel, graphe, pile, file, type_memoire, voisins, animation){
	

	this.graphe = graphe;
	this.pile = pile;
	this.file = file;
	this.type_memoire = type_memoire;
	if(type_memoire == "pile"){
		this.memoire = this.pile;
	}
	else if(type_memoire == "file"){
		this.memoire = this.file;
	}

	this.voisins = voisins;
	this.pinceau = document.getElementById(id_canvas).getContext("2d");
	this.animation = animation;
	this.couleursNormal = couleursNormal;//contient fond et texte
	this.couleursActuel = couleursActuel;
	this.ETAT = 1;

	this.sommet_actuel = 0;
	this.sommets_vues = [];


	this.etats_X = [100, 100, 100, 100, 100, 250];
	this.etats_Y = [25, 95, 175, 230, 285, 95];
	this.etats_W = [140, 140, 140, 140, 140, 80];
	this.etats_H = [40, 70, 40, 40, 40, 40];
	this.etats_formes = ['r','l','r','r','r','r'];
	this.etats_textes = [['Initialisation'],['la mémoire','est vide ?'],['prendre un sommet','en mémoire'],['recuperer','ses voisins'],['Ajouter les nouveaux','sommets en mémoire'],['FIN']];


	this.pinceau.strokeStyle = 'black';
	this.pinceau.lineWidth = 2; 
			
	this.pinceau.beginPath();
				
	this.pinceau.moveTo(100, 25);
	this.pinceau.lineTo(100, 285);
			
	this.pinceau.moveTo(100, 95);
	this.pinceau.lineTo(240, 95);

	this.pinceau.moveTo(100, 95);
	this.pinceau.lineTo(10, 95);
	this.pinceau.lineTo(10, 285);
	this.pinceau.lineTo(100, 285);

	this.pinceau.stroke();




	this.pinceau.strokeStyle = 'black';
	this.pinceau.lineWidth = 2; 
			
	this.pinceau.beginPath();
				
	this.pinceau.moveTo(100, 58);
	this.pinceau.lineTo(97, 55);
	this.pinceau.lineTo(103, 55);
	this.pinceau.closePath();
			
	this.pinceau.moveTo(100, 153);
	this.pinceau.lineTo(97, 150);
	this.pinceau.lineTo(103, 150);
	this.pinceau.closePath();

	this.pinceau.moveTo(100, 208);
	this.pinceau.lineTo(97, 205);
	this.pinceau.lineTo(103, 205);
	this.pinceau.closePath();

	this.pinceau.moveTo(100, 263);
	this.pinceau.lineTo(97, 260);
	this.pinceau.lineTo(103, 260);
	this.pinceau.closePath();

	this.pinceau.moveTo(28,95);
	this.pinceau.lineTo(25, 92);
	this.pinceau.lineTo(25, 98);
	this.pinceau.closePath();

	this.pinceau.moveTo(208,95);
	this.pinceau.lineTo(205, 92);
	this.pinceau.lineTo(205, 98);
	this.pinceau.closePath();

	this.pinceau.stroke();
	this.pinceau.fill();

	this.pinceau.font = '11pt Calibri';
			
	this.pinceau.textAlign = 'left';
	this.pinceau.textBaseline = 'bottom';
	this.pinceau.fillText('OUI', 170, 90);

	this.pinceau.textAlign = 'left';
	this.pinceau.textBaseline = 'top';
	this.pinceau.fillText('NON', 105, 130);

	this.get_visible = function(){
		var delta = $("#"+id_canvas).offset().top - $(window).scrollTop();
		var hauteur = $("#"+id_canvas).height();
		
		if(delta < $(window).height()-hauteur/2 && delta >-hauteur/2){
			return true;
		}
		else{
			return false;
		}
	}

	this.tracer_losange = function(x,y,w,h,couleur){
		//Trace un losance dont le centre est en x,y de largeure w et de hauteur h

		//trace du losange
		this.pinceau.beginPath();
		this.pinceau.moveTo(x,y-h/2);
		this.pinceau.lineTo(x+w/2,y);
		this.pinceau.lineTo(x,y+h/2);
		this.pinceau.lineTo(x-w/2,y);
		this.pinceau.closePath();

		//bordure
		this.pinceau.lineWidth = 2;
		this.pinceau.strokeStyle = "black";
		
		//fond
		this.pinceau.fillStyle = couleur;
		
		//trace
		this.pinceau.fill();
		this.pinceau.stroke();
	}

	this.tracer_rectangle = function(x,y,w,h,couleur){
		//Trace un rectangle dont le centre est en x,y de largeure w et de hauteur h

		this.pinceau.beginPath();
		this.pinceau.lineWidth = 2;
		this.pinceau.strokeStyle = "black";
		this.pinceau.fillStyle = couleur;
		
		this.pinceau.rect(x-w/2, y-h/2, w, h);
		
		this.pinceau.fill();	
		this.pinceau.stroke();
	}

	this.tracer_etats = function(){
		for(var etat = 1 ; etat<=this.etats_Y.length ; etat++){
			if(this.ETAT == etat){
				var couleur = this.couleursActuel[0];
				var couleurs_texte = this.couleursActuel[1];
			}
			else{
				var couleur = this.couleursNormal[0];
				var couleurs_texte = this.couleursNormal[1];
			}
			if(this.etats_formes[etat-1] == 'r'){
				this.tracer_rectangle(this.etats_X[etat-1],this.etats_Y[etat-1],this.etats_W[etat-1],this.etats_H[etat-1],couleur);
			}
			else if(this.etats_formes[etat-1] == 'l'){
				this.tracer_losange(this.etats_X[etat-1],this.etats_Y[etat-1],this.etats_W[etat-1],this.etats_H[etat-1],couleur);
			}
			this.pinceau.beginPath();
			
			this.pinceau.fillStyle = couleurs_texte;
			this.pinceau.font = '11pt Calibri';
			
			this.pinceau.textAlign = 'center';

			if(this.etats_textes[etat-1].length == 1){
				this.pinceau.textBaseline = 'middle';
				this.pinceau.fillText(this.etats_textes[etat-1], this.etats_X[etat-1], this.etats_Y[etat-1]);
	
			}
			else if(this.etats_textes[etat-1].length == 2){
				
				this.pinceau.textBaseline = 'bottom';
				this.pinceau.fillText(this.etats_textes[etat-1][0], this.etats_X[etat-1], this.etats_Y[etat-1]-1);
				
				this.pinceau.textBaseline = 'top';
				this.pinceau.fillText(this.etats_textes[etat-1][1], this.etats_X[etat-1], this.etats_Y[etat-1]+1);

			}
			
		}
		
	}


	this.initialisation  = function(){
		//initialisation du graphe
		this.graphe.initialisation();
		this.graphe.tracer_tout();

		//initialisation de la memoire
		this.ETAT = 1;
		this.tracer_etats();
		
		this.memoire.liste = [];//on remet la memoire a 0, elle serra rempli pendant l'etat 1
		this.memoire.tracer();

		this.voisins.liste = [];//on vide la liste des voisins
		this.voisins.tracer();

		this.sommets_vues = [];//on suppremie les sommets vue
	}

	this.suivant = function(afficher){
		//fonction qui fait passe à l'état suivant. elle depende de afficher, et de this.animation
		if(this.get_visible()){
			if(afficher){
				this.tracer_etats();
			}
			
			if(this.ETAT == 1){

				//Tant qu'on a pas mis toutes les entrées en mémoire, on reste dans cet etat
				var n = this.memoire.liste.length;
				if(n < this.graphe.entrees.length){
					this.memoire.ajouter(this.graphe.entrees[n], this.animation, afficher);
				}
				if(this.memoire.liste.length == this.graphe.entrees.length){
					this.ETAT = this.ETAT+1;
				}

			}

			else if(this.ETAT == 2){

				//vérification de la condition de bouclage
				// Juste une animation visuelle à ajouter sur le schéma de l'algo
				if(this.memoire.liste.length == 0){
					this.ETAT = 6;// On sort de la boucle

				}
				else{
					this.ETAT = 3;
				}

			}

			else if(this.ETAT == 3){

				//marquer le somet actuel comme vue
				this.sommet_actuel = this.memoire.recuperer(this.animation, afficher);
				this.graphe.etats[this.sommet_actuel-1] = 4;
				this.sommets_vues.push(this.sommet_actuel);
				if(afficher){
					this.graphe.annuler_cadres([this.sommet_actuel]);
				}

				this.ETAT = 4;

			}

			else if(this.ETAT == 4){

				//recuperer les voisins du sommet actuel
				var v = this.graphe.voisins(this.sommet_actuel, afficher);


				//les encadrer
				if(afficher){
					for(var k = 0 ; k < v.length ; k++){
						var n = v[k];
						var l = ((n-1)-(n-1)%this.graphe.Nx)/this.graphe.Nx;
						var c = (n-1)%this.graphe.Nx;
						var xk = this.graphe.x0+c*(this.graphe.caseX+this.graphe.bordure);
						var yk = this.graphe.y0+l*(this.graphe.caseY+this.graphe.bordure);
						this.graphe.tracer_cadre(xk,yk,this.graphe.couleurVoisins, 2);
					}
				
				}


				for(var k = 0 ; k<v.length ; k++){
					this.voisins.ajouter(v[k], false, afficher);
				}
				this.ETAT = 5;
				
			}

			else if(this.ETAT == 5){

				if(this.animation){//Si il y a l'animation, on traite les sommet 1 à 1

					//mettre les sommets qui ne sont pas deja vue dans memoire
					var n = this.voisins.recuperer(this.animation, afficher);

					if(this.graphe.etats[n-1] != 4 && this.graphe.etats[n-1] != 3){
						//Si on a pas deja vue ce sommet
						this.memoire.ajouter(n, this.animation, afficher);
						this.graphe.etats[n-1] = 3;
					}
					this.graphe.annuler_cadres([n]);

					if(this.voisins.liste.length == 0){
						this.ETAT = 2;
					}
				}
				else{//Sinon, on les traites tous d'un coup en n'affichant que à la fin

					while(this.voisins.liste.length > 0){
						var n = this.voisins.recuperer(false, false);

						if(this.graphe.etats[n-1] != 4 && this.graphe.etats[n-1] != 3){
							//Si on a pas deja vue ce sommet
							this.memoire.ajouter(n, false, false);
							this.graphe.etats[n-1] = 3;
						}
						if(afficher){
							this.graphe.annuler_cadres([n]); //met de la bonne couleur le cadre
						}
						
					}

					if(afficher){
						this.memoire.tracer();
						this.voisins.tracer();
					}

					this.ETAT = 2;

				}
			}
		}
	}

	this.suivant_rapide = function(){
		if(this.ETAT == 2 || this.ETAT == 3 || this.ETAT == 4 || this.ETAT == 5){
			this.suivant(false);
			while(this.ETAT == 3 || this.ETAT == 4 || this.ETAT == 5){
				//Tant qu'on est dans la boucle
				this.suivant(false);
			}
		}
		else{
			this.suivant(false);
		}
		this.tracer_etats();
		this.graphe.tracer_tout();
		this.memoire.tracer();
		this.voisins.tracer();
	}


	this.precedant = function(){
		if(this.get_visible()){
			var nombres_de_vues = this.sommets_vues.length;
			if(nombres_de_vues >0){
				nombres_de_vues--;
			}

			this.initialisation();

			while(this.ETAT != 3 || nombres_de_vues != this.sommets_vues.length){
				this.suivant(false);
			}

			this.graphe.tracer_tout();
			this.memoire.tracer();
			this.voisins.tracer();
			this.tracer_etats();
		

		this.tracer_etats();
		}

	}
	

	this.set_nouvelle_memoire = function(type){
		//change le type de mémoire (si c'est utile)
		
		if(type == "pile" && this.type_memoire == "file"){
			this.memoire = this.pile;
			this.type_memoire = "pile";
			this.initialisation();
		}
		else if(type == "file" && this.type_memoire == "pile"){
			this.memoire = this.file;
			this.type_memoire = "file";
			this.initialisation();
		}
		
	}

	this.modifier_vitesse = function(lvl){
		//fonction qui va modifier la vitesse de la fonction next()
		//  1 -> vitesse normale, avec animations
		//  2 -> accéléré en supprimant les animations
		//  3 -> accéléré en supprimant la boucle
		if(lvl == 1 || lvl == 2){
			this.next = function(){this.suivant(true);};
			if(lvl == 1){
				this.animation = true;
			}
			else{
				this.animation = false;
			}
		}
		else if(lvl == 3){
			this.next = function(){this.suivant_rapide();};
		}
	}

	this.finir = function(){
		while(this.ETAT != 6 && this.ETAT != 0){
			this.suivant(false);
		}
	}

	this.initialisation();
	this.modifier_vitesse(1);
}
