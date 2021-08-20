//l'ojet fonctionne 
//retravailler l'esthetique
//	-quand on déplie, le element s'arretent des qu'ils sont à leur place (eviter qu'ils fassent un aller retour)
//	-ne pas ganger les delta d'un coup, les gerer avec des nombres à virgules (-1.5 immplique la moitier est à -1, et l'autre moitier à -2)
function Pile(liste_init, x0, y0, dx, dy, horientation, h, w, couleurF, couleurT, id){

	if(horientation=="vertical"){
		//coordonnees initiales
		this.x0 = x0;
		this.y0 = y0;
		//tailles où on peut écrire (Car le pt de réference est en bas à gauche)
		this.dx = dx;
		this.dy = dy;
	}
	else{
		//coordonnees initiales
		this.x0 = x0;
		this.y0 = y0;
		//tailles où on peut écrire (Car le pt de réference est en bas à gauche) 
		this.dx = dx;
		this.dy = dy;
	}
	this.horientation = horientation;
	//taillle des cases (height, wigth)
	this.h = h;
	this.w = w;

	this.couleurF = couleurF//Couleu de fond
	this.couleurT = couleurT//couleur du texte

	this.liste = liste_init;
	this.liste_elements = [];

	this.draw = SVG(id).size(dx,dy);

	this.sortie;
	this.sortie_element;

	this.tracer_liste = function(animer){
		animer=false;
		//Calcul des constantes
		var delta = 5;
		var N = this.liste.length;

		if(this.horientation=="vertical"){
			var D = this.dy;
			var d = this.h;
		}
		else{
			var D = this.dx;
			var d = this.w;
		}
		if( N*(d+delta) > D ){
			// Il n'y a pas la place nécessaire pour tout mettre
			delta = delta - Math.ceil((d+N*(d+delta)-D)/N);
			if( delta/d < -0.6 ){
				//Le recouvrement dépasse les 80%, du coup on ne va pas tout afficher
				delta = -Math.ceil(0.6*d);
				N =  Math.ceil( (D - d) / (d + delta));//Faire +1 si on veut faire dépasser le tout
			}
		}

		var i0 = this.liste.length-N;
		
		//Début du tracé
		for(var i=0 ; i<this.liste.length ; i++){
			if(i<i0){
				//Ces cases ne doivent pas apparaitre.
				//this.liste_elements[i].hide();
			}
			else{
				if(!this.liste_elements[i].visible()){
					this.liste_elements[i].show();
				}
				this.liste_elements[i].forward();
				if(animer){
					this.liste_elements[i].stop();
					if(this.horientation == "vertical"){
						this.liste_elements[i].animate().move(this.x0 , this.y0 + (this.liste_elements.length-i-1)*(this.h+delta));
					}
					else{
						this.liste_elements[i].animate().move(this.x0 + (this.liste_elements.length-i-1)*(this.w+delta) , this.y0);
					}
				}
				else{
					if(this.horientation == "vertical"){
						this.liste_elements[i].move(this.x0 , this.y0 + (this.liste_elements.length-i-1)*(this.h+delta));
					}
					else{
						this.liste_elements[i].move(this.x0 + (this.liste_elements.length-i-1)*(this.w+delta) , this.y0);
					}
				}
			}
		}
	}
	
	this.ajouter = function(txt, afficher, animer){
		var group = this.draw.group();
		var r = group.rect(this.w, this.h).attr({ fill: this.couleurF, stroke: '#000','stroke-width':3});
		var t = group.text(txt+"").center(r.cx(),r.cy()).attr({fill: this.couleurT});

		if(this.horientation == "vertical"){
			group.move(this.x0 , this.y0-this.h-5);
		}
		else{
			group.move(this.x0 -this.w-5 , this.y0);
		}
		this.liste_elements.push(group);
		this.liste.push(txt);
		if(afficher){
			this.tracer_liste(animer);
		}
	}

	this.recuperer = function(animer){
		animer = false;
		this.sortie = this.liste.pop();
		this.sortie_element = this.liste_elements.pop();

		if(animer){
			if(this.horientation == "vertical"){
				this.sortie_element.animate().move(this.x0 , this.y0-this.h-5).after(function() {this.remove();});
			}
			else{
				this.sortie_element.animate().move(this.x0 -this.w -5 , this.y0).after(function() {this.remove();});
			}
		}
		else{
			if(this.horientation == "vertical"){
				this.sortie_element.remove();
			}
			else{
				this.sortie_element.remove();
			}
		}
		this.tracer_liste(animer);
		if(animer){this.sortie_element.forward();}//Pour que l'élèment soit toujours au dessus
		return this.sortie
	}

	this.initialiser = function(animer){
		for( var i = 0 ; i< this.liste.length ; i++){
			var group = this.draw.group();
			var r = group.rect(this.w, this.h).attr({ fill: this.couleurT, stroke: '#000','stroke-width':3});
			var t = group.text(this.liste[i]).center(r.cx(),r.cy()).attr({fill: this.couleurT});
			if(this.horientation == "vertical"){
			group.move(this.x0 , this.y0-this.h-5);
			}
			else{
				group.move(this.x0 -this.w-5 , this.y0);
			}
		
			this.liste_elements.push(group);
		}
		this.tracer_liste(animer);
	}
	
	this.initialiser(true);

	this.tracer = function(){
		this.tracer_liste(false);
	}
	
}

