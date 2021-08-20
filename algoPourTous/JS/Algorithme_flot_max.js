function Algorithme_flot_max(id_canvas, x0, y0, dx, dy, debut, fin, graphe, graphe_aide){
	this.pinceau = document.getElementById(id_canvas).getContext("2d");
	this.pinceau.font = '20pt Calibri';
	this.pinceau.fillStyle = 'black';
	this.pinceau.textAlign = 'left';
	this.pinceau.textBaseline = 'top';

	//coordonnées initiales
	this.x0 = x0;
	this.y0 = y0;
	//distance du canvas alloué au dessin de ce tableau
	this.limX = dx;
	this.limY = dy;

	this.debut = debut;
	this.fin = fin;

	this.graphe = graphe;
	this.graphe_aide = graphe_aide;

	this.ETAT = 0;
	this.profondeur = true;
	this.chemin;

	this.suivant = function(afficher){
		if(this.ETAT == 0){
			if(afficher){
				this.pinceau.clearRect(0,0, this.limX, this.limY);
			}

			//chercher apres un chemin
			this.chemin = this.graphe.get_chemin(this.debut, this.fin, this.profondeur);

			if(this.chemin.length > 0){
				var N = this.chemin.length-1;

				for(var i = 0 ; i < N ; i++){
					var k = this.graphe.get_arete(this.chemin[i], this.chemin[i+1]);
					//alert(this.chemin[i] + " , "+this.chemin[i+1]+" -> "+k);
					if(k>=0){
						if(this.graphe.aretes[k].ETAT == 0){
							this.graphe.aretes[k].ETAT = 2;
							this.graphe_aide.aretes[k].ETAT = 1;
						}
						else if(this.graphe.aretes[k].ETAT == 1){
							this.graphe.aretes[k].ETAT = 3;
							this.graphe_aide.aretes[k].ETAT = 1;
						}
					}
					else{
						var k = this.graphe.get_arete(this.chemin[i+1], this.chemin[i]);
						if(this.graphe.aretes[k].ETAT == 0){
							this.graphe.aretes[k].ETAT = 2;
							this.graphe_aide.aretes[k].ETAT = 1;
						}
						else if(this.graphe.aretes[k].ETAT == 1){
							this.graphe.aretes[k].ETAT = 3;
							this.graphe_aide.aretes[k].ETAT = 1;
						}
					}
				}
				if(afficher){
					this.graphe.tracer(false, 0, 0);
					this.graphe_aide.tracer(false, 0, 0);

					this.pinceau.font = '20pt Calibri';
					this.pinceau.fillStyle = 'black';
					this.pinceau.textAlign = 'left';
					this.pinceau.textBaseline = 'top';
					var l1 = this.pinceau.measureText("On trouve le chemin : ").width;
					var texte = ""+this.graphe.sommets[this.chemin[0]];
					var N = this.chemin.length;
					for(var i = 1 ; i < N ; i++){
						texte = texte + " -> "+this.graphe.sommets[this.chemin[i]];
					}
					var l2 = this.pinceau.measureText(texte).width;
					this.pinceau.fillText("On trouve le chemin : " , (this.limX-l1-l2)/2, 5);

					this.pinceau.fillStyle = 'green';
					this.pinceau.fillText(texte, (this.limX+l1-l2)/2, 5);
				}
				this.ETAT = 1;
			}
			else{
				this.ETAT = 4;
				this.pinceau.font = '20pt Calibri';
				this.pinceau.fillStyle = 'black';
				this.pinceau.textAlign = 'center';
				this.pinceau.textBaseline = 'bottom';
				this.pinceau.fillText("Il n'y a plus de chemin entre la source et le puit" , this.limX/2, this.limY/3);
				
				var flot_max = 0;
				var N = this.graphe.sommets.length;
				for(var j = 0 ; j < N ; j++){
					if(this.graphe.matrice_valeurs[j][this.fin] != "inf"){
						flot_max = flot_max + this.graphe.matrice_valeurs[j][this.fin];
					}
				}
				this.pinceau.textAlign = 'left';
				var l1 = this.pinceau.measureText("le flot maximal est : ").width;
				var l2 = this.pinceau.measureText(flot_max).width;

				this.pinceau.fillText("le flot maximal est : ", (this.limX-l1-l2)/2, 2*this.limY/3);
				this.pinceau.fillStyle = "blue";
				this.pinceau.fillText(flot_max, (this.limX+l1-l2)/2, 2*this.limY/3);

				
			}
		}
		else if(this.ETAT == 1){
			//chercher le remplissage limite de ce chemin
			var info = this.graphe.get_limitant(this.chemin);
			var k = this.graphe.get_arete(info[1], info[2]);

			this.graphe.aretes[k].ETAT = 4;
			this.graphe_aide.aretes[k].ETAT = 2;
			if(afficher){
				this.graphe.aretes[k].tracer(true, true);
				this.graphe_aide.aretes[k].tracer(false, true);

				this.pinceau.font = '20pt Calibri';
				this.pinceau.fillStyle = 'black';
				this.pinceau.textAlign = 'left';
				this.pinceau.textBaseline = 'top';

				var l1 = this.pinceau.measureText("On ne peut pas ajouter plus que ").width;
				var l2 = this.pinceau.measureText(info[0]).width;
				var l3 = this.pinceau.measureText(" à ce chemin à cause de l'arête ").width;

				var texte = this.graphe.sommets[info[1]]+" -> " + this.graphe.sommets[info[2]];
				var l4 = this.pinceau.measureText(texte).width;

				this.pinceau.fillText("On ne peut pas ajouter plus que ", (this.limX-l1-l2-l3-l4)/2, 40);
				this.pinceau.fillStyle = "orange";
				this.pinceau.fillText(info[0], (this.limX+l1-l2-l3-l4)/2, 40);
				this.pinceau.fillStyle = "black";
				this.pinceau.fillText(" à ce chemin à cause de l'arête ", (this.limX+l1+l2-l3-l4)/2, 40);
				this.pinceau.fillStyle = "orange";
				this.pinceau.fillText(texte, (this.limX+l1+l2+l3-l4)/2, 40);
			}
			this.ETAT = 2;
		}
		else if(this.ETAT == 2){
			//remplir le chemin
			this.graphe.remplir(this.chemin, afficher);
			this.ETAT = 3;

			if(afficher){
				this.pinceau.font = '20pt Calibri';
				this.pinceau.fillStyle = 'black';
				this.pinceau.textAlign = 'center';
				this.pinceau.textBaseline = 'top';
				this.pinceau.fillText("On vient de remplir au maximum ce chemin", this.limX/2, 80);
			}
		}
		else if(this.ETAT == 3){
			//mettre a jour graphiquement l'aide
			var N = this.graphe.aretes.length;
			for(var i = 0 ; i < N ; i++){
				var i1 = this.graphe.get_id_Sommet(this.graphe.aretes[i].noeud1.nom);
				var i2 = this.graphe.get_id_Sommet(this.graphe.aretes[i].noeud2.nom);
				if(this.graphe.matrice[i1][i2] == this.graphe.matrice_valeurs[i1][i2]){
					this.graphe.aretes[i].ETAT = 1;
					this.graphe_aide.aretes[i].ETAT = 0;
					this.graphe_aide.aretes[i].direction = 2;
				}
				else{
					this.graphe.aretes[i].ETAT = 0;
					this.graphe_aide.aretes[i].ETAT = 0;
					if(this.graphe.matrice_valeurs[i1][i2] == 0){
						this.graphe_aide.aretes[i].direction = 1;
					}
					else{
						this.graphe_aide.aretes[i].direction = 0;
					}
					
				}
			}
			if(afficher){
				this.graphe.tracer(false, 0, 0);
				this.graphe_aide.tracer(false, 0, 0);

				this.pinceau.font = '20pt Calibri';
				this.pinceau.fillStyle = 'black';
				this.pinceau.textAlign = 'center';
				this.pinceau.textBaseline = 'top';
				this.pinceau.fillText("On vient de mettre à jour le graphe d'aide (celui de droite)", this.limX/2, 120);
			}
			this.ETAT = 0;
		}
	} 

}